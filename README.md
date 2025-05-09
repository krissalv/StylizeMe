# StylizeMe

A cross-platform mobile application for personal styling and outfit planning.

## Features

- User authentication (sign up, login, password reset)
- Profile management
- Outfit planning
- Style tips and recommendations
- Cross-platform support (iOS, Android, Web)

## Tech Stack

- React Native
- Expo
- Firebase Authentication
- Firebase Firestore
- React Navigation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/StylizeMe.git
   cd StylizeMe
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```
3. To run the app the the additional dependencies need to be installed: 
# Install React Navigation
npm install @react-navigation/native

# Install dependencies for React Navigation (required for linking and navigation)
npm install react-native-screens react-native-safe-area-context

# Install the Stack Navigator
npm install @react-navigation/stack


4. Start the development server:
   ```
   npx expo start
   ```

5. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Project Structure

- `app/` - Main application code
  - `(auth)/` - Authentication screens (login, register, welcome)
  - `(tabs)/` - Tab-based navigation screens (home, explore, profile)
  - `item/` - Item detail screens
- `assets/` - Images, fonts, and other static assets
- `components/` - Reusable UI components
- `config/` - Configuration files (Firebase, etc.)
- `context/` - React context providers
- `utils/` - Utility functions and helpers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/)
