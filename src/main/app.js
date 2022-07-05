import {app, BrowserWindow, protocol, Menu, nativeImage, Tray, dialog, netLog, net, desktopCapturer,globalShortcut} from "electron";
import path from "path";
import fs from "fs";
const nodeAbi = require('node-abi')

console.log(nodeAbi.getAbi('19.0.3', 'electron'))
// import logger from "../utils/logger"

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
// console.time('screencapture')
// const child_process = require("child_process");
// child_process.exec(`screencapture -i -c`,  (error, stdout, stderr) => {
//     console.log("308", error);
//     console.timeEnd('screencapture')
//     if (!error) {
//         //截图完成，在粘贴板中
//         console.log("screen success!")
//     }
// });
const robot = require("robotjs");

// // Speed up the mouse.
// robot.setMouseDelay(2);
//
// var twoPI = Math.PI * 2.0;
// var screenSize = robot.getScreenSize();
// var height = (screenSize.height / 2) - 10;
// var width = screenSize.width;
//
// for (var x = 0; x < width; x++)
// {
//     let y = height * Math.sin((twoPI * x) / width) + height;
//     robot.moveMouse(x, y);
// }
// var mouse = robot.getMousePos();
//
// // Get pixel color in hex format.
// var hex = robot.getPixelColor(mouse.x, mouse.y);
// console.log("#" + hex + " at x:" + mouse.x + " y:" + mouse.y);
// var size = 100;
// var img = robot.screen.capture(mouse.x, mouse.y, size, size);
// console.log(img)
// fs.writeFileSync(path.join(app.getPath("downloads"),"test.bmp"),img.image)

app.on("ready", () => {
    const ret = globalShortcut.register('CommandOrControl+X', () => {
        const mouse = robot.getMousePos();
        robot.moveMouseSmooth(mouse.x+100, mouse.y+200);

    })
    if (!ret) {
        console.log('registration failed')
    }
    // 检查快捷键是否注册成功
    console.log(globalShortcut.isRegistered('CommandOrControl+X'))


    // desktopCapturer.getSources({
    //     types: ['window', 'screen'],
    //     // thumbnailSize:{
    //     //     width:5120,
    //     //     height:2880
    //     // }
    // }).then(async sources => {
    //     var arr = new Array()
    //     sources.forEach(async item=>{
    //         fs.writeFileSync(path.join(app.getPath("downloads"), item.id), item.buffer)
    //     })
    //     for (const source of sources) {
    //         logger.info(source.name)
    //         var buffer = source.thumbnail.toJPEG(100)
    //         // console.log(buffer)
    //         // await fs.writeFile(path.join(app.getPath("downloads"), source.name), "buffer").catch(req => {
    //         //     console.log(req)
    //         // })
    //         console.log(source.id)
    //         var item = {
    //             id:source.name,
    //         buffer:source.thumbnail.toJPEG(100)
    //     }
    //        await arr.push(item)
    //         // await fs.writeFile(path.join(app.getPath("downloads"), source.name), buffer).catch(req => {
    //         //     console.log(req)
    //         // })
    //     }
    //     arr.forEach(async item=>{
    //          fs.writeFileSync(path.join(app.getPath("downloads"), item.id+".jpeg"), item.buffer)
    //     })
    // })

//     console.time('capture')
//     desktopCapturer.getSources({
//         types: ['screen','window'],
//         thumbnailSize: {width: 5120 * 1, height: 2880 * 1,}
//     }).then(sources => {
//         console.timeEnd('capture')
//     })
//
//     let filepath = path.join(app.getPath("documents"), '/logs/');
//     let nowdate = new Date();
//     let nowdate_str = nowdate.getFullYear() + "_" + (nowdate.getMonth() + 1) + "_" + nowdate.getDate() + "_" + nowdate.getHours();
//     let filename = "mylog_" + nowdate_str + ".log";
//     zlog.transports.file.resolvePath = () => path.join(filepath, filename);
//     zlog.transports.file.level = true;
//     zlog.transports.console.level = true;
// // 日志打印格式
//     zlog.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
//
//     zlog.info('这是个提示日志');
//     zlog.warn('这是个警告日志');
//     zlog.error('这是个错误日志');
//     logger.info("Test Log4js ", JSON.stringify(process.env))


    // filepath = path.join(app.getPath("documents"), '/logs/');
    // nowdate = new Date();
    // nowdate_str = nowdate.getFullYear() + "_" + (nowdate.getMonth() + 1) + "_" + nowdate.getDate() + "_" + nowdate.getHours();
    // filename = "mynet_" + nowdate_str + ".log";
    // netLog.startLogging(path.join(filepath, filename));
    // let request = net.request("http://www.taobao.com")
    // request.on("response", (response) => {
    //     // 获取请求状态码
    //     console.log(JSON.stringify(response.statusCode))
    //     // 获取请求头
    //     console.log(JSON.stringify(response.headers));
    //
    //     // 监听是否有数据
    //     response.on("data", (chunk) => {
    //         console.log(chunk.toString())
    //     })
    //     netLog.stopLogging()
    // })
    // request.end()


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

app.on('will-quit', () => {
    // 注销快捷键
    // globalShortcut.unregister('CommandOrControl+X')

    // 注销所有快捷键
    globalShortcut.unregisterAll()
})
