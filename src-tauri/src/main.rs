//! Main Rust application entry point with VPN status monitoring
//!
//! @file main.rs
//! @created 2026-02-01
//! @author Christian Blank <christianblank91@gmail.com>
//! @copyright 2026 Christian Blank

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod vpn_checker;

use std::sync::{Arc, Mutex};
use tauri::{
    image::Image,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, State,
};
use tokio::time::{interval, Duration};
use vpn_checker::{check_vpn_status, VpnStatus};

/// Application state shared across threads
struct AppState {
    last_status: Arc<Mutex<Option<VpnStatus>>>,
}

/// Icon status for visual indicators
#[derive(Clone, Copy)]
enum IconStatus {
    Connected,
    Disconnected,
    Unknown,
}

/// Returns the current VPN status from the application state
/// Called from the frontend via Tauri command
#[tauri::command]
async fn get_vpn_status(state: State<'_, AppState>) -> Result<VpnStatus, String> {
    let status = state.last_status.lock().unwrap();
    status.clone().ok_or_else(|| "Status not available yet".to_string())
}

/// Toggles auto-start on Windows boot
#[tauri::command]
fn toggle_autostart(enable: bool) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        let exe_path = std::env::current_exe()
            .map_err(|e| e.to_string())?
            .to_string_lossy()
            .to_string();

        if enable {
            Command::new("reg")
                .args(&[
                    "add",
                    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
                    "/v",
                    "MullvadConnectionStatus",
                    "/t",
                    "REG_SZ",
                    "/d",
                    &format!("\"{}\"", exe_path),
                    "/f"
                ])
                .output()
                .map_err(|e| e.to_string())?;
            Ok("Auto-start enabled".to_string())
        } else {
            Command::new("reg")
                .args(&[
                    "delete",
                    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
                    "/v",
                    "MullvadConnectionStatus",
                    "/f"
                ])
                .output()
                .map_err(|e| e.to_string())?;
            Ok("Auto-start disabled".to_string())
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        Err("Auto-start only supported on Windows".to_string())
    }
}

/// Checks if auto-start is enabled
#[tauri::command]
fn check_autostart() -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        let output = Command::new("reg")
            .args(&[
                "query",
                "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
                "/v",
                "MullvadConnectionStatus"
            ])
            .output()
            .map_err(|e| e.to_string())?;

        Ok(output.status.success())
    }

    #[cfg(not(target_os = "windows"))]
    {
        Ok(false)
    }
}

/// Updates the system tray icon and window icon based on connection status
/// Green icon for connected, red for disconnected
fn update_tray_icon(app: &AppHandle, connected: bool) {
    // Choose status based on connection
    let status = if connected {
        IconStatus::Connected
    } else {
        IconStatus::Disconnected
    };

    // Update tray icon
    if let Some(tray) = app.tray_by_id("main-tray") {
        let icon = load_tray_icon(status);
        let _ = tray.set_icon(Some(icon));

        // Update tooltip
        let tooltip = if connected {
            "Mullvad VPN: Connected"
        } else {
            "Mullvad VPN: Disconnected"
        };
        let _ = tray.set_tooltip(Some(tooltip));
    }

    // Update window/taskbar icon
    if let Some(window) = app.get_webview_window("main") {
        let icon = load_tray_icon(status);
        let _ = window.set_icon(icon);
    }
}

/// Starts the background task that polls the Mullvad API
/// Checks status every 15 seconds and emits events on changes
fn start_status_monitor(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        let mut poll_interval = interval(Duration::from_secs(15));

        loop {
            poll_interval.tick().await;

            match check_vpn_status().await {
                Ok(status) => {
                    // Get previous status to detect changes
                    let state = app.state::<AppState>();
                    let mut last_status = state.last_status.lock().unwrap();

                    let status_changed = match &*last_status {
                        Some(prev) => prev.connected != status.connected,
                        None => true,
                    };

                    // Update stored status
                    *last_status = Some(status.clone());
                    drop(last_status);

                    // Update UI and tray
                    update_tray_icon(&app, status.connected);
                    let _ = app.emit("vpn-status-changed", status.clone());

                    // Show notification on status change
                    if status_changed {
                        let message = if status.connected {
                            format!(
                                "Connected to {} server",
                                status.country.as_deref().unwrap_or("Mullvad")
                            )
                        } else {
                            "VPN connection lost".to_string()
                        };

                        #[cfg(desktop)]
                        {
                            use tauri_plugin_notification::NotificationExt;
                            let _ = app
                                .notification()
                                .builder()
                                .title("Mullvad Connection Status")
                                .body(&message)
                                .show();
                        }
                    }
                }
                Err(e) => {
                    eprintln!("Failed to check VPN status: {}", e);
                }
            }
        }
    });
}

/// Loads a tray icon from a PNG file
/// Icons are located in the src-tauri/icons directory
fn load_tray_icon(status: IconStatus) -> Image<'static> {
    let icon_name = match status {
        IconStatus::Connected => "tray-connected.png",
        IconStatus::Disconnected => "tray-disconnected.png",
        IconStatus::Unknown => "tray-unknown.png",
    };

    // Load icon from file
    let icon_path = std::path::Path::new("icons").join(icon_name);
    let icon_bytes = std::fs::read(&icon_path)
        .unwrap_or_else(|e| panic!("Failed to load tray icon {:?}: {}", icon_path, e));

    Image::from_bytes(&icon_bytes)
        .unwrap_or_else(|e| panic!("Failed to parse tray icon {:?}: {}", icon_path, e))
}

/// Sets up the system tray icon and menu
/// Creates menu items for showing the window and quitting
fn setup_tray(app: &tauri::App) -> tauri::Result<()> {
    let show_item = MenuItemBuilder::with_id("show", "Show Status").build(app)?;
    let quit_item = MenuItemBuilder::with_id("quit", "Quit").build(app)?;

    let menu = MenuBuilder::new(app)
        .item(&show_item)
        .separator()
        .item(&quit_item)
        .build()?;

    // Load tray icon for unknown status (blue shield with question mark)
    let icon = load_tray_icon(IconStatus::Unknown);

    let _tray = TrayIconBuilder::with_id("main-tray")
        .icon(icon)
        .tooltip("Mullvad Connection Status")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            match event {
                TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                } => {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("main") {
                        if window.is_visible().unwrap_or(false) {
                            let _ = window.hide();
                        } else {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                }
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Initialize app state
            app.manage(AppState {
                last_status: Arc::new(Mutex::new(None)),
            });

            // Setup system tray
            setup_tray(app)?;

            // Start background status monitoring
            start_status_monitor(app.handle().clone());

            // Handle window close event to hide instead of quit
            let window = app.get_webview_window("main").unwrap();

            // Set initial window icon for taskbar (unknown status)
            #[cfg(target_os = "windows")]
            {
                let icon = load_tray_icon(IconStatus::Unknown);
                let _ = window.set_icon(icon);
            }

            let window_clone = window.clone();
            window.on_window_event(move |event| {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    // Don't close, just hide
                    window_clone.hide().unwrap();
                    api.prevent_close();
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_vpn_status,
            toggle_autostart,
            check_autostart
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run();
}
