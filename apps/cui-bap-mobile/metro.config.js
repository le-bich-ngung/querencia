const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    assetExts: ['bin','txt','jpg','png','gif','webp','svg','ttf','otf','mp4','mp3','wav'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
