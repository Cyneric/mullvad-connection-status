/**
 * @file lib.rs
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Library entry point for mobile builds
 */

#[cfg(mobile)]
mod mobile;
#[cfg(mobile)]
pub use mobile::*;

pub mod vpn_checker;
