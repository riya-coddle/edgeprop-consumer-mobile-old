# fresh-install react-native dependencies, installing by pakcage.json (npm)
rm -rf node_modules && npm install && react-native link
react-native link react-native-fbsdk;react-native link react-native-fabric;react-native link react-native-maps;react-native link react-native-firebase

# after the above has done, then if you see Library/AirMaps.xcodeproj & Link binary with libraries > libAirMaps.a (in Xcode), you can remove them first.
# then continue the below 

# remove ios Pods
rm -rf ios/Pods
rm ios/Podfile.lock
rm -rf ios/build

# POD install
# containing install react-native-maps, react-native-google-maps, and its dependencies
cd ios
pod install

# after that, you will see *.xcworkspace. we are gonna use this project file to open our project.
# not use *.xcodeproj anymore

# Intercom installation
npm install
react-native link
cd ios
pod install