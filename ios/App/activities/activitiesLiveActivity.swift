//
//  activitiesLiveActivity.swift
//  activities
//
//  Created by Kemal Yalcinkaya on 09.04.25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct activitiesAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct activitiesLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: activitiesAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension activitiesAttributes {
    fileprivate static var preview: activitiesAttributes {
        activitiesAttributes(name: "World")
    }
}

extension activitiesAttributes.ContentState {
    fileprivate static var smiley: activitiesAttributes.ContentState {
        activitiesAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: activitiesAttributes.ContentState {
         activitiesAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: activitiesAttributes.preview) {
   activitiesLiveActivity()
} contentStates: {
    activitiesAttributes.ContentState.smiley
    activitiesAttributes.ContentState.starEyes
}
