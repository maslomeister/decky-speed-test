# Speed Test plugin for Decky

<p float="left">
  
<img src="https://github.com/maslomeister/decky-speed-test/blob/main/assets/plugin1.jpg?raw=true" width="300" />
<img src="https://github.com/maslomeister/decky-speed-test/blob/main/assets/plugin2.jpg?raw=true" width="300" />

</p>

## About

Speed Test is a plugin for [Decky](https://github.com/SteamDeckHomebrew/decky-loader) that can perform speed tests on your steam deck using [cloudflares speedtest package](https://github.com/cloudflare/speedtest), the results of each test saved locally.

- After speed test is started plugin window can be closed and reopened, the result will be saved on completion independent of plugin visibility

## 💪 Todo

- [x] Add ability to toggle between Mbps and MBs
- [ ] Add ability to view all performed speed tests in a paginated form
- [x] onClick popup with description for speed test metrics

## ⭕️ Known issues

### Speed test fails to start/complete

Sometimes speed test fails to start/complete - to fix it, restart your steam
`Steam => Power => Restart Steam`

The underlying issue is coming from [cloudflares speedtest package](https://github.com/cloudflare/speedtest), it's mentioned in this [issue](https://github.com/cloudflare/speedtest/issues/36), when fix is found it will be implemented here

## 💾 Installation

To install Speed Test manually:

1. Go to the [Speed Test GitHub repository](https://github.com/maslomeister/decky-speed-test).
2. Download the latest release package (ZIP format).
3. Copy the zip file to SteamDeck and install it from Decky loader.

# 🤝 Contributing

Contributions to Speed Test are welcome! If you would like to contribute, please follow these steps:

1. Fork the decky-speed-test repository.
2. Create a new branch for your feature or bug fix.
3. Make the necessary changes in your branch.
4. Commit your changes and push them to your fork.
5. Submit a pull request to the main decky-speed-test repository.

## 📜 Credits

[SDH-PlayTime](https://github.com/ma3a/SDH-PlayTime) - some of python backend code was adopted from this plugin.

Special thanks to the [Decky Plugin Loader](https://github.com/SteamDeckHomebrew/decky-loader) project for providing the infrastructure and support for developing plugins on the SteamDeck console.
