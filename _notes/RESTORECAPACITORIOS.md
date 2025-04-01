  # Restore Capacitor iOs

- Select team for Signing & Capabilities
- Add Capabilities
  - Push Notifications
- Add GoogleService-Info(plist)
- Edit Info(plist)
  -
    ```
    <key>NSSupportsLiveActivities</key>
    <true/>
    <key>NSSupportsLiveActivitiesFrequentUpdates</key>
    <true/>
    ```
- Add Widgets bundle (WidgetExtensions target) and Shared (as a Framework target)

- At AppDelegate
  - Add the LiveActivities starters
  - Add Notification listeners
- Generate Capacitor icons