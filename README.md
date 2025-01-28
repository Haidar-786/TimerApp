# React Native Timer App
This is a React Native application that allows users to create, manage, and interact with multiple customizable timers. The app supports features like categories, progress visualization, and bulk actions, while maintaining a clean UI/UX with minimal third-party dependencies.

# Features
# Core Features
# Add Timer

Users can create new timers with the following fields:
Name: The name of the timer (e.g., "Workout Timer").
Duration: Timer duration in seconds.
Category: Assign a category to the timer (e.g., "Workout," "Study," "Break").
The timer is saved to a list and persisted locally using AsyncStorage.
Timer List with Grouping

Display all timers grouped by their categories in expandable/collapsible sections.
For each timer, the following information is displayed:
Name
Remaining time
Status: Running, Paused, or Completed.
Users can expand or collapse categories to view timers within them.
Timer Management

# Controls for each timer to:
Start: Begin countdown.
Pause: Pause countdown.
Reset: Reset to original duration.
Complete: Mark timers as "Completed" when they reach zero.
Progress Visualization

A progress bar or percentage showing the remaining time relative to the total duration of each timer.
Bulk Actions

# Category-level buttons for bulk actions:
Start all timers in a category.
Pause all timers in a category.
Reset all timers in a category.
User Feedback

Upon timer completion, show an on-screen modal with a congratulatory message and the timer’s name.
Enhanced Functionality
Timer History

# Maintain a log of completed timers, including:
Timer name.
Completion time.
Display the log on a separate "History" screen.
Customizable Alerts

# Allow users to set an optional halfway alert (e.g., at 50% of the total duration).
Show a notification or message when the alert triggers.
Setup Instructions
Prerequisites
Ensure that you have the following installed:

# Node.js (version 14 or higher)
# React Native CLI
# Java Development Kit (JDK)
# Android Studio (for Android development) or Xcode (for iOS development)
# Watchman (for macOS users)
# Steps to Run the Project
# Clone the repository

#Clone this repository to your local machine:

# In the terminal

git clone https://github.com/your-username/react-native-timer-app.git
Install dependencies

Navigate to the project directory and install the required dependencies:

# In the terminal

cd react-native-timer-app
npm install
Or, if you prefer Yarn:

# In the terminal

yarn install
Link native dependencies (if necessary)

For React Native versions 0.59 and below, you might need to link native dependencies manually. This can be done with the following command:

# In the terminal

react-native link
However, for React Native 0.60 and above, auto-linking will take care of this.

Run the app on Android

Make sure you have an Android emulator running or a physical Android device connected. Run the following command to start the app:

# In the terminal

npx react-native run-android
If you're using iOS, run the following:

# In the terminal

npx react-native run-ios
This will launch the app on your connected device or emulator.

# Assumptions Made During Development
State Management: The app does not use a global state management library like Redux, relying on React's useState and useEffect hooks for state handling.

Persisting Data: Local storage is managed via AsyncStorage. Timers and user data are saved persistently, and on app restart, the timers are loaded from the storage.

Simple Alerts: Timer completion notifications and halfway alerts are shown using basic Alert.alert() && Model for simplicity. For more advanced notifications, a third-party library like react-native-notifications & @notifee/react-native could be integrated.

Timer Accuracy: Timers are run using setInterval() with 1-second precision. For more precise timing, other solutions could be used, but this meets the basic requirements.

Error Handling: Basic error handling is implemented for loading and saving timers to local storage. More comprehensive error handling could be added as needed.

UI/UX Design: The design is minimal and user-friendly. Further enhancements and customizations can be made to improve the user experience, such as adding animations, transitions, or advanced styles.

Code Structure
Here’s an overview of the code structure:

# In the terminal

/src
  /components       # Contains reusable components (e.g., TimerCard, ProgressBar, etc.)
  /screens         # Contains screens like TimerListScreen, HistoryScreen, etc.
  /services        # Contains logic for saving/loading timers from AsyncStorage
  /assets          # Images, icons, fonts, etc.
  /styles          # Global styles
  App.js           # Main entry point for the app


Additional Commands for React Native CLI
Here are some useful commands when working with React Native:

Start Metro Bundler (Development server):

# In the terminal
npx react-native start
Install a specific package:

# In the terminal
npm install <package-name>
Clean the Android build (if necessary):

# In the terminal
cd android && ./gradlew clean