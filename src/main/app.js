import { app, BrowserWindow,protocol} from "electron";
import path from "path";
import fs from "fs";
const { SerialPort } = require('serialport')

// https://github.com/serialport/electron-serialport/blob/HEAD/renderer.js
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

async function listSerialPorts() {
    try {
        const ports = await SerialPort.list()
        if (ports.length === 0) {
            console.log('No ports discovered')
        }
        return ports
    } catch (error) {
        console.error(error)
        return []
    }
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
setTimeout(async function listPorts() {
    setTimeout(listPorts, 1000)
    const ports = await listSerialPorts()
    console.log(JSON.stringify(ports))

    BrowserWindow.getFocusedWindow()?.webContents.send('serialport', JSON.stringify(ports))
}, 1000)




// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.


protocol.registerSchemesAsPrivileged([
    {
        scheme: "app",
        privileges: {
            standard: true,
            supportFetchAPI: true,
            secure: true,
            corsEnabled: true,
        },
    },
]);

app.on("ready", () => {
    protocol.registerBufferProtocol("app", (request, response) => {
        let pathName = new URL(request.url).pathname;
        let extension = path.extname(pathName).toLowerCase();
        if (!extension) return;
        pathName = decodeURI(pathName);
        let filePath = path.join(__dirname, pathName);
        fs.readFile(filePath, (error, data) => {
            if (error) return;
            let mimeType = "";
            if (extension === ".js") {
                mimeType = "text/javascript";
            } else if (extension === ".html") {
                mimeType = "text/html";
            } else if (extension === ".css") {
                mimeType = "text/css";
            } else if (extension === ".svg") {
                mimeType = "image/svg+xml";
            } else if (extension === ".json") {
                mimeType = "application/json";
            }
            response({ mimeType, data });
        });
    });

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
        console.log(`app://./index.html`)
        mainWindow.loadURL(`app://./index.html`);
    } else {
       // 开发时 http 访问
        mainWindow.loadURL(`http://localhost:${process.env.WEB_PORT}/`);
    }

});
