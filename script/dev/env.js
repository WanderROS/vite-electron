module.exports = {
    APP_VERSION: require("../../package.json").version,
    ENV_NOW: "development",
    ELECTRON_DISABLE_SECURITY_WARNINGS: true, // 去除Electron安全警告
};
