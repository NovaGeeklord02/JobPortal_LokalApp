# JobFinderApp (React Native Expo)

A mobile application built with React Native (Expo) allowing users to browse job listings fetched from a public API, view job details, and bookmark jobs for offline access. This project was created as part of an assignment.

## Features

*   Browse Job Listings: Fetches job data from the specified API endpoint.
*   Infinite Scrolling: Loads more jobs automatically as the user scrolls down the list.
*   Job Details: Tap on a job card to view more detailed information on a separate screen (including Title, Location, Salary, Experience, Description, etc.).
*   Bookmarking: Users can bookmark jobs they are interested in.
*   Offline Bookmarks: Bookmarked jobs are saved locally using AsyncStorage and are viewable even when offline via the "Bookmarks" tab.
*   Bottom Tab Navigation: Simple navigation between the "Jobs" list and the "Bookmarks" section.
*   UI States: Includes visual indicators for loading, error, and empty list states.
*   User Interface: Uses React Native Paper for Material Design components, providing a clean UI.

## Tech Stack

*   React Native / Expo SDK
*   JavaScript
*   React Navigation (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`)
*   React Native Paper (UI Components)
*   AsyncStorage (`@react-native-async-storage/async-storage`) for offline bookmark storage
*   Expo Vector Icons (`@expo/vector-icons`)

## API Endpoint

The application fetches job data from the following public endpoint:

`https://testapi.getlokalapp.com/common/jobs`

Pagination is handled by appending `?page=<page_number>`.



## Setup and Running

Prerequisites:

*   Node.js (LTS version recommended) and npm/yarn
*   Git
*   Expo Go app installed on your Android/iOS device OR a configured Android/iOS simulator/emulator.

Instructions:

1. Clone the repository:
    ```bash
    git clone https://github.com/YourUsername/JobFinderApp.git # Replace with your actual repository URL
    ```

2. Navigate to the project directory:
    ```bash
    cd JobFinderApp
    ```

3. Install dependencies:
    ```bash
    npm install
    # or: yarn install
    ```

4.  Ensure correct package versions for your Expo SDK:
    ```bash
    npx expo install --fix
    ```

5. Start the development server:
    ```bash
    npx expo start
    ```
    *This will start the Metro Bundler and display a QR code.*

6. Run the app:
      On your phone: Open the Expo Go app and scan the QR code shown in the terminal.



## Potential Future Improvements

  Implement Search and Filtering functionality for jobs.
  Add pull-to-refresh functionality to the Bookmarks screen.
  Improve error handling visuals and messages.
  Write unit and integration tests.
  Add more UI polish and potentially animations.



This README provides a basic overview.      

