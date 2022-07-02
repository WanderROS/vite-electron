import {app, BrowserWindow, protocol, Menu, nativeImage, Tray, dialog, netLog, net} from "electron";
import path from "path";
import fs from "fs";

import logger from "../utils/logger"

const zlog = require('electron-log');
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
    let filepath = path.join(app.getPath("documents"), '/logs/');
    let nowdate = new Date();
    let nowdate_str = nowdate.getFullYear() + "_" + (nowdate.getMonth() + 1) + "_" + nowdate.getDate() + "_" + nowdate.getHours();
    let filename = "mylog_" + nowdate_str + ".log";
    zlog.transports.file.resolvePath = () => path.join(filepath, filename);
    zlog.transports.file.level = true;
    zlog.transports.console.level = true;
// 日志打印格式
    zlog.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

    zlog.info('这是个提示日志');
    zlog.warn('这是个警告日志');
    zlog.error('这是个错误日志');
    logger.info("Test Log4js ", JSON.stringify(process.env))


    filepath = path.join(app.getPath("documents"), '/logs/');
    nowdate = new Date();
    nowdate_str = nowdate.getFullYear() + "_" + (nowdate.getMonth() + 1) + "_" + nowdate.getDate() + "_" + nowdate.getHours();
    filename = "mynet_" + nowdate_str + ".log";
    netLog.startLogging(path.join(filepath, filename));
    let request = net.request("http://www.taobao.com")
    request.on("response", (response) => {
        // 获取请求状态码
        console.log(JSON.stringify(response.statusCode))
        // 获取请求头
        console.log(JSON.stringify(response.headers));

        // 监听是否有数据
        response.on("data", (chunk) => {
            console.log(chunk.toString())
        })
        netLog.stopLogging()
    })
    request.end()


    // const template = [{
    //     label: 'Edit',
    //     submenu: [
    //         {label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:'},
    //         {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:'},
    //         {type: 'separator'},
    //         {label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:'},
    //         {label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
    //         {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'},
    //         {label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:'},
    //         {
    //             label: 'Quit',
    //             accelerator: 'CmdOrCtrl+Q',
    //             click() {
    //                 app.quit()
    //             }
    //         }
    //     ]
    // }]
    // let menu = Menu.buildFromTemplate(template)
    // Menu.setApplicationMenu(menu)
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
        // mainWindow.loadURL("https://www.hao123.com");
    }

});
