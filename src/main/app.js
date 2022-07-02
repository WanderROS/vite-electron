import { app, BrowserWindow,protocol,session} from "electron";
import path from "path";
import fs from "fs";
const youtubedl = require('youtube-dl-exec')

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


// youtubedl('https://www.youtube.com/watch?v=2ueCGvCL27E', {
//     proxy: 'socks5://127.0.0.1:1080'
// }).then(output => console.log(output))






app.on("ready", () => {
    const subprocess = youtubedl.exec('https://www.youtube.com/watch?v=GNQ43LzDSW8', {
        dumpJson:true,
        proxy: 'socks5://127.0.0.1:1080'
    });
    subprocess.stdout.on("data", (data) => {
        const liveData = data.toString();
        // console.log(JSON.parse(liveData))
        console.log(liveData)
    });
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
            enableRemoteModule: true,
            partition:'persist:unique_random_path2'
        },
    });
  let mainWindow2 = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            partition:'persist:unique_random_path'
        },
    });
    if (app.isPackaged) {
        console.log("打包后执行");
        console.log(`app://./index.html`)
        mainWindow.loadURL(`app://./index.html`);
    } else {
       // mainWindow.webContents.session.setProxy({
       //     proxyRules: 'socks5://localhost:1080'
       // }).then(r =>{
       //     console.log(r)
       // })
        mainWindow.webContents.session.setProxy({
           proxyRules: 'http://localhost:8889'
       }).then(r =>{
          console.log(r)
       })
      //  console.log(app.commandLine)

       // 开发时 http 访问
       //  mainWindow.loadURL(`http://localhost:${process.env.WEB_PORT}/`);
        mainWindow.loadURL("https://ip38.com/");

        mainWindow2.webContents.session.setProxy({
            proxyRules: ''
        }).then(r =>{
            console.log(r)
        })
        mainWindow2.loadURL("https://ip38.com/");
    }
});
