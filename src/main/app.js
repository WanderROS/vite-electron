import {app, BrowserWindow, protocol, Menu,nativeImage,Tray,dialog} from "electron";
import path from "path";
import fs from "fs";

const logger = require('electron-log');

logger.transports.file.level = 'info';
logger.transports.file.fileName = 'electron-test.log';

let tray;

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
    const template = [{
        label: 'Edit',
        submenu: [
            {label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:'},
            {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:'},
            {type: 'separator'},
            {label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:'},
            {label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
            {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'},
            {label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:'},
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }]
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '关于',
            click () {
                dialog.showMessageBox({
                    title: 'Vite-Electron',
                    message: '关于',
                    detail: `Version: ${process.env.APP_VERSION}\nAuthor: WanderROS\nGithub: https://github.com/WanderROS`
                })
            }
        }
        ])
    // 定位图标
    const icon = nativeImage.createFromPath(path.join(__dirname, 'trayTemplate.png'))
    tray = new Tray(icon)
    tray.on('right-click', () => {
        tray.popUpContextMenu(contextMenu)
    })
    logger.info('electron test app start at ', new Date());
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
            response({mimeType, data});
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
