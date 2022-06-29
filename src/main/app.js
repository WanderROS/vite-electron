import { app, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";

app.on("ready", () => {

  let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
    });
    if (app.isPackaged) {
        console.log("打包后执行");
        mainWindow.loadURL("https://wwww.hao123.com")
    } else {
       // 开发时 http 访问
        mainWindow.loadURL(`http://localhost:${process.env.WEB_PORT}/`);
    }
});
