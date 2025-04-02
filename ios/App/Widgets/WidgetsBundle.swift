//
//  WidgetsBundle.swift
//  Widgets
//
//  Created by Kemal Yalcinkaya on 01.04.25.
//

import WidgetKit
import SwiftUI

@main
struct WidgetsBundle: WidgetBundle {
    var body: some Widget {
        Widgets()
        WidgetsControl()
        // WidgetsLiveActivity()
        OutsLiveActivityConfiguration()
    }
}
