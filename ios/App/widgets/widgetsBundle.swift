//
//  widgetsBundle.swift
//  widgets
//
//  Created by Kemal Yalcinkaya on 01.04.25.
//

import WidgetKit
import SwiftUI

@main
struct widgetsBundle: WidgetBundle {
    var body: some Widget {
        widgets()
        widgetsControl()
        OutstandingLiveActivityConfiguration()
    }
}
