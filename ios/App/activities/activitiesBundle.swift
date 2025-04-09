//
//  activitiesBundle.swift
//  activities
//
//  Created by Kemal Yalcinkaya on 09.04.25.
//

import WidgetKit
import SwiftUI

@main
struct activitiesBundle: WidgetBundle {
    var body: some Widget {
        activities()
        activitiesControl()
        activitiesLiveActivity()
        OutsLiveActivityConfiguration()
    }
}
