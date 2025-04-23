import ActivityKit
import Foundation

struct RadialAttributes: ActivityAttributes {
    public typealias OutsStatus = ContentState

    public struct ContentState: Codable, Hashable {
        var status: String
        var progress: Double
        var endMessage: String?
    }

    var title: String
}
