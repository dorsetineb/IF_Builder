// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  #[cfg(target_os = "linux")]
  {
    // Fix WebKitWebProcess crashes on Linux caused by WebKitGTK DMA-BUF renderer and GPU compositing
    if std::env::var_os("WEBKIT_DISABLE_DMABUF_RENDERER").is_none() {
      std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }
    if std::env::var_os("WEBKIT_DISABLE_COMPOSITING_MODE").is_none() {
      std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
    }
    // Prevent NVIDIA Wayland protocol crashes
    if std::env::var_os("__NV_DISABLE_EXPLICIT_SYNC").is_none() {
      std::env::set_var("__NV_DISABLE_EXPLICIT_SYNC", "1");
    }

    // If running inside AppImage, route GStreamer to bundled plugins to prevent host ABI mismatches
    if let Ok(appdir) = std::env::var("APPDIR") {
      let gst_plugins = format!("{}/usr/lib/x86_64-linux-gnu/gstreamer-1.0", appdir);
      let gst_scanner = format!("{}/usr/lib/x86_64-linux-gnu/gstreamer1.0/gstreamer-1.0/gst-plugin-scanner", appdir);
      if std::path::Path::new(&gst_plugins).exists() {
        std::env::set_var("GST_PLUGIN_SYSTEM_PATH_1_0", &gst_plugins);
        std::env::set_var("GST_PLUGIN_PATH_1_0", &gst_plugins);
      }
      if std::path::Path::new(&gst_scanner).exists() {
        std::env::set_var("GST_PLUGIN_SCANNER_1_0", &gst_scanner);
      }
    }
  }

  app_lib::run();
}
