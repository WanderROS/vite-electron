module.exports = {
    APP_VERSION: require("../../package.json").version,
    ENV_NOW: "production",
    ELECTRON_DISABLE_SECURITY_WARNINGS: true, // 去除Electron安全警告
};
