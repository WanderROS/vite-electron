let vite = require("vite");
let vue = require("@vitejs/plugin-vue");
let path = require("path");
let esBuild = require("esbuild");
let { spawn } = require("child_process");
let os = require("os");
let fs = require("fs");

let dev = {
    server: null,
    serverPort: 1600,
    electronProcess: null,
    async createServer() {
        let options = {
            configFile: false,
            root: process.cwd(),
            server: {
                port: this.serverPort
            },
            plugins: [vue()],
        };
        this.server = await vite.createServer(options);
        await this.server.listen();
    },
    getEnvScript() {
        let env = require("./env.js");
        env.WEB_PORT = this.serverPort;
        let script = "";
        for (let v in env) {
            script += `process.env.${v}="${env[v]}";\n`;
        }
        return script;
    },
    buildMain() {
        let entryFilePath = path.join(process.cwd(), "src/main/app.js");
        let outfile = path.join(process.cwd(), "release/bundled/entry.js");
        esBuild.buildSync({
            entryPoints: [entryFilePath],
            outfile,
            minify: false,
            bundle: true,
            platform: "node",
            sourcemap: true,
            external: ["electron"],
        });
        let envScript = this.getEnvScript();
        let js = `${envScript}${os.EOL}${fs.readFileSync(outfile)}`;
        fs.writeFileSync(outfile, js);
    },
    createElectronProcess() {
        this.electronProcess = spawn(
            require("electron").toString(),
            [path.join(process.cwd(), "release/bundled/entry.js")],
            { cwd: process.cwd() }
        );
        this.electronProcess.on("close", () => {
            this.server.close();
            process.exit();
        });
        this.electronProcess.stdout.on("data", (data) => {
            data = data.toString();
            console.log(data);
        });
    },
    async start() {
        await this.createServer();
        await this.buildMain();
        this.createElectronProcess();
    },
};
dev.start();
