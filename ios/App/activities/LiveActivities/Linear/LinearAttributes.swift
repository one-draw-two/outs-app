import ActivityKit
import Foundation

struct LinearAttributes: ActivityAttributes {
    public typealias OutsStatus = ContentState

    public struct ContentState: Codable, Hashable {
        var status: String
        var progress: Double
        var endMessage: String?  // Add this to display an end message
    }

    var title: String
}
