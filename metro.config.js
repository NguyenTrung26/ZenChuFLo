// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Mở rộng cấu hình mặc định
config.resolver.assetExts.push('cjs'); // Thêm 'cjs' vào danh sách extensions

// Thêm phần này để giải quyết các vấn đề với semver và reanimated trên web
config.resolver.sourceExts.push('js', 'json', 'ts', 'tsx', 'cjs');
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'semver': require.resolve('semver'),
};

module.exports = config;