import { app, BrowserWindow, protocol } from "electron";
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
    // new Promise(((resolve, reject) => {
    //   let instance =spawn("screencapture",["-c","-i"])
    //   instance.on('error',err => {
    //     reject(err.toString())
    //   })
    //   instance.stderr.on('data',err=>{
    //     reject(err.toString())
    //   })
    //   instance.on('close',code => {
    //     console.log('capture',code)
    //     code ===0 ?resolve(true):resolve(false)
    //   })
    // }))
    if (app.isPackaged) {
        // console.log(start, Date.now() - start);
        // mainWindow.loadURL(`app://./index.html`);
    } else {
       // console.log(start, Date.now() - start);
        mainWindow.loadURL(`http://localhost:${process.env.WEB_PORT}/`);
    }
});
