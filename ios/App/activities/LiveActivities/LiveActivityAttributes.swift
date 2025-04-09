import Foundation
import ActivityKit

struct OutsWednesdayLiveActivityAttributes: ActivityAttributes {
    public typealias OutsStatus = ContentState

    public struct ContentState: Codable, Hashable {
        var status: String
        var progress: Double
    }
    
    var title: String
}
