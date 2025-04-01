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

    <key>ITSAppUsesNonExemptEncryption</key>
    <false/>
    <key>com.apple.security.application-groups</key>
    <array>
      <string>group.your.bundle.identifier</string>
    </array>
    ```
    
- Add Widgets bundle (WidgetExtensions target) and Shared (as a Framework target)
  - Important note: You need to convert thr directories into Groups otherwise Xcode witll give a build error:
  - https://www.reddit.com/r/iOSProgramming/comments/1exsax9/comment/lj8njst

- At AppDelegate
  - Add the LiveActivities starters
  - Add Notification listeners

- Generate Capacitor icons