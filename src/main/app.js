import { app, BrowserWindow,protocol} from "electron";
import path from "path";
import fs from "fs";

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
