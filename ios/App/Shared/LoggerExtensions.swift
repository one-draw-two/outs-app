
import Foundation
import os.log

@_exported import os.log

public extension Logger {
    private static let subsystem = Bundle.main.bundleIdentifier ?? "com.default"
    static let liveActivity = Logger(subsystem: subsystem, category: "⚽️ 🎯 liveactivity")
    static let deepLink = Logger(subsystem: subsystem, category: "⚽️ 🔗 deeplink")
}
