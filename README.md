# WakeMeUp 🚌⏰

A React Native Expo app that predicts public transport arrival times and sets alarms accordingly. Never miss your bus, tram, or train again!

## 🌟 Features

### 🚇 Real-time Transport Information
- **PTV API Integration**: Real-time data for Melbourne's public transport network
- **GPS Location Services**: Find nearby stops automatically
- **Route Planning**: Smart route selection with arrival time predictions
- **Multi-transport Support**: Buses, trams, trains, and more

### ⏰ Intelligent Alarm System
- **Arrival-based Alarms**: Set alarms based on predicted arrival times
- **Manual Alarms**: Traditional time-based alarms with repeat options
- **Real-time Updates**: Live countdown with estimated arrival times
- **Alarm History**: Track and manage your alarm history

### 🗺️ Location & Navigation
- **Nearby Stops**: Discover transport stops near your location
- **Route Visualization**: Interactive maps showing your journey
- **Destination Search**: Google Places API integration for destination finding
- **Current Location**: Automatic detection of your starting point

### 🎨 User Experience
- **Beautiful UI**: Modern design with beige color theme
- **Accessibility**: Full support for screen readers and keyboard navigation
- **Responsive Design**: Works seamlessly across different screen sizes
- **Intuitive Navigation**: Easy-to-use interface with home button on all screens

## 📱 Screenshots

*Screenshots will be added here*

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack Navigator)
- **Maps**: React Native Maps
- **Location**: Expo Location
- **APIs**: 
  - PTV (Public Transport Victoria) API
  - Google Places API
- **State Management**: React Context API
- **Styling**: StyleSheet with custom theme

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jhlee0214/WakeMeUp.git
   cd WakeMeUp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   PTV_API_KEY=your_ptv_api_key_here
   PTV_USER_ID=your_ptv_user_id_here
   GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   ```

4. **API Keys Setup**
   
   **PTV API (Required for Melbourne transport data):**
   - Visit [PTV API Developer Portal](https://www.ptv.vic.gov.au/footer/data-and-reporting/datasets/ptv-timetable-api/)
   - Register for an API key and user ID
   
   **Google Places API (Optional for destination search):**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Places API
   - Create API key

5. **Run the app**
   ```bash
   npx expo start
   ```

## 📖 Usage Guide

### Setting Up an Arrival Alarm

1. **Launch the app** - Start with the loading screen
2. **Select Transport Type** - Choose bus, tram, train, etc.
3. **Choose Current Station** - Select your starting point
4. **Select Route** - Pick your specific route
5. **Set Destination** - Choose where you want to go
6. **Configure Alarm** - Set how early you want to be alerted
7. **Review & Confirm** - Check your alarm settings
8. **Activate** - Your alarm is now active!

### Manual Alarm

1. **Go to Manual Alarm** - From the main menu
2. **Set Time** - Choose your desired alarm time
3. **Configure Repeat** - Set daily, weekly, or custom repeat
4. **Save** - Your manual alarm is ready

### Managing Alarms

- **Active Alarms**: Green banner shows remaining time
- **History**: View all past alarms
- **Real-time Updates**: Live countdown updates

## 🏗️ Project Structure

```
WakeMeUpApp/
├── App.tsx                 # Main app component
├── src/
│   ├── components/         # Reusable components
│   │   ├── ActiveAlarmBanner.tsx
│   │   └── HeaderWithHomeButton.tsx
│   ├── context/           # Global state management
│   │   └── AlarmContext.tsx
│   ├── screens/           # App screens
│   │   ├── LoadingScreen.tsx
│   │   ├── MainPage.tsx
│   │   ├── SelectTransportPage.tsx
│   │   ├── SelectCurrentStationPage.tsx
│   │   ├── SelectRoutePage.tsx
│   │   ├── DestinationPage.tsx
│   │   ├── AlarmTimeSettingPage.tsx
│   │   ├── AlarmPreviewPage.tsx
│   │   ├── ArrivalAlarmPage.tsx
│   │   ├── ManualAlarmPage.tsx
│   │   └── HistoryPage.tsx
│   ├── styles/            # Common styles
│   │   └── common.ts
│   ├── types/             # TypeScript definitions
│   │   └── transport.ts
│   ├── utils/             # Utility functions
│   │   └── accessibility.ts
│   ├── test/              # Test files
│   │   └── ptv-api-test.ts
│   └── ptv-config.ts      # PTV API configuration
├── assets/                # App assets
└── package.json
```

## 🔧 Configuration

### PTV API Configuration

The app uses PTV's API for real-time transport data. Configure in `src/ptv-config.ts`:

```typescript
export const PTV_API_KEY = 'your_api_key';
export const PTV_USER_ID = 'your_user_id';
export const PTV_BASE_URL = 'https://timetableapi.ptv.vic.gov.au';
```

### Theme Configuration

Customize the app's appearance in `src/styles/common.ts`:

```typescript
export const colors = {
  primary: '#D4C4A8',      // Beige
  secondary: '#E8DCC0',    // Light beige
  accent: '#8B7355',       // Dark beige
  // ... more colors
};
```

## 🧪 Testing

Run the PTV API test to verify connectivity:

```bash
npx ts-node src/test/ptv-api-test.ts
```

## 📱 Platform Support

- **iOS**: Full support with native features
- **Android**: Full support with native features
- **Web**: Limited support (some features may not work)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PTV (Public Transport Victoria)** for providing the transport API
- **Expo** for the amazing development platform
- **React Native** community for the excellent documentation and tools

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/jhlee0214/WakeMeUp/issues) page
2. Create a new issue with detailed information
3. Include your device/OS information and error logs

## 🔮 Future Features

- [ ] Push notifications for alarm alerts
- [ ] Offline mode support
- [ ] Multiple city support
- [ ] Social features (share routes)
- [ ] Voice commands
- [ ] Widget support
- [ ] Apple Watch integration

---

**Made with ❤️ for Melbourne commuters** 