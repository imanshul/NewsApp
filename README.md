# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

##Transcript

Build a news app that fetches the top 100 news headlines, stores them for offline access, displays them in a dynamic list view, and allows user interaction.
To do this:
1. Set up a new React Native project using either Expo or React Native CLI.
2. For Fetching and Storing Headlines:
    * Implement a background task to fetch the top 100 news headlines from a news API of your choice. for e.g. https://newsapi.org/
    * Store these headlines in local storage for offline access.
3. Splash Screen and Initial View:
    * On app load, display a splash logo of your choice.
    * After the splash screen, then show a list view with the first 10 headlines.
4. Dynamic List Update:
    * Set up a timer that introduces a new batch of up to 5 random headlines to the top of the list every 10 seconds.
    * Allow users to manually trigger fetching the next batch from local storage and resetting the drip timer.
5. Handling Exhaustion of Headlines:
    * When all headlines from the current batch have been displayed, reset local storage.
    * Fetch the next batch of headlines and populate the list view.
6. User Interaction:
    * Allow users to swipe a headline to delete it or pin it to the top of the view.
    * A pinned headline should stay in view when the list updates, whether manually or automatically.
    * Deleting a headline should remove it from view, with the next headline appearing at the top of the list.
7. Testing:
    * Test the app to ensure all functionalities work as expected.
    * Document any assumptions made and provide clear instructions on how to run the app.


##What you need?

You need to have API key from newsapi in order to run the project, once API key is generated you can replace <API_KEY> in APIConstant.ts file and run the app.