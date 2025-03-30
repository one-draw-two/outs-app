//
//  OutstandingWidgetsBundle.swift
//  OutstandingWidgets
//
//  Created by Kemal Yalcinkaya on 30.03.25.
//

import WidgetKit
import SwiftUI

@main
struct OutstandingWidgetsBundle: WidgetBundle {
    var body: some Widget {
        OutstandingWidgets()
        OutstandingWidgetsControl()
        OutstandingLiveActivityConfiguration()
    }
}
