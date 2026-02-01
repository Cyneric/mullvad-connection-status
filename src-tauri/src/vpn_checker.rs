/**
 * @file vpn_checker.rs
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description VPN status checker using Mullvad's public API
 */

use serde::{Deserialize, Serialize};

/// Response structure from Mullvad's am.i.mullvad.net API
#[derive(Debug, Deserialize)]
struct MullvadApiResponse {
    mullvad_exit_ip: bool,
    ip: Option<String>,
    country: Option<String>,
    city: Option<String>,
    mullvad_exit_ip_hostname: Option<String>,
    mullvad_server_type: Option<String>,
}

/// VPN status information exposed to the frontend
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VpnStatus {
    pub connected: bool,
    pub ip: Option<String>,
    pub country: Option<String>,
    pub city: Option<String>,
    pub hostname: Option<String>,
    pub server_type: Option<String>,
}

/**
 * Checks the current VPN connection status by querying Mullvad's API
 *
 * Makes an HTTP request to https://am.i.mullvad.net/json which returns
 * information about the current connection including whether traffic
 * is routed through a Mullvad server
 *
 * Returns a VpnStatus struct with connection details
 */
pub async fn check_vpn_status() -> Result<VpnStatus, Box<dyn std::error::Error>> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()?;

    let response = client
        .get("https://am.i.mullvad.net/json")
        .send()
        .await?;

    let api_response: MullvadApiResponse = response.json().await?;

    Ok(VpnStatus {
        connected: api_response.mullvad_exit_ip,
        ip: api_response.ip,
        country: api_response.country,
        city: api_response.city,
        hostname: api_response.mullvad_exit_ip_hostname,
        server_type: api_response.mullvad_server_type,
    })
}
