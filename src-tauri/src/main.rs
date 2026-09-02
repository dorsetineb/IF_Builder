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
      let candidate_plugin_dirs = [
        format!("{}/usr/lib/x86_64-linux-gnu/gstreamer-1.0", appdir),
        format!("{}/usr/lib/gstreamer-1.0", appdir),
        format!("{}/usr/lib64/gstreamer-1.0", appdir),
        format!("{}/usr/lib/gstreamer1.0", appdir),
      ];

      let mut found_plugins = Vec::new();
      for dir in &candidate_plugin_dirs {
        if std::path::Path::new(dir).is_dir() {
          found_plugins.push(dir.clone());
        }
      }

      if !found_plugins.is_empty() {
        let joined = found_plugins.join(":");
        std::env::set_var("GST_PLUGIN_SYSTEM_PATH_1_0", &joined);
        std::env::set_var("GST_PLUGIN_PATH_1_0", &joined);
      }

      let candidate_scanners = [
        format!("{}/usr/lib/x86_64-linux-gnu/gstreamer1.0/gstreamer-1.0/gst-plugin-scanner", appdir),
        format!("{}/usr/lib/gstreamer1.0/gstreamer-1.0/gst-plugin-scanner", appdir),
        format!("{}/usr/libexec/gstreamer-1.0/gst-plugin-scanner", appdir),
        format!("{}/usr/lib/x86_64-linux-gnu/gstreamer-1.0/gst-plugin-scanner", appdir),
        format!("{}/usr/lib/gstreamer-1.0/gst-plugin-scanner", appdir),
      ];

      for scanner in &candidate_scanners {
        if std::path::Path::new(scanner).is_file() {
          std::env::set_var("GST_PLUGIN_SCANNER_1_0", scanner);
          break;
        }
      }
    }
  }

  app_lib::run();
}
