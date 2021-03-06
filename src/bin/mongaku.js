#! /usr/bin/env node

const path = require("path");

const minimist = require("minimist");
const shell = require("shelljs");

const pkg = require("../../package.json");

const args = minimist(process.argv.slice(2));

const cmd = args._[0];
const extraArgs = args._.slice(1);

const localFile = file => path.resolve(__dirname, file);
const getBinary = bin => {
    const binPath = localFile(`../../node_modules/.bin/${bin}`);

    if (!shell.which(binPath)) {
        console.error(`${bin} not found. Please run 'npm install'.`);
        process.exit(1);
    }

    return binPath;
};

const runBabel = watch => {
    const rootDir = localFile("../..");
    const srcDir = path.join(rootDir, "src");
    const buildDir = path.join(rootDir, "build");
    const configFile = path.join(rootDir, ".babelrc");
    const binary = getBinary("babel");

    const cmd = `${binary} ${srcDir} --out-dir ${buildDir} --config-file ${configFile} --verbose`;

    if (watch) {
        return shell.exec(`${cmd} -w`, {async: true});
    }

    return shell.exec(cmd);
};

const runWebpack = watch => {
    const rootDir = localFile("../..");
    const configFile = path.join(rootDir, "webpack.config.js");
    const binary = getBinary("webpack");

    const cmd = `${binary} --config ${configFile}`;

    if (watch) {
        return shell.exec(`${cmd} -w`, {async: true});
    }

    return shell.exec(cmd);
};

const runSupervisor = () => {
    const cwd = process.cwd();
    const localDir = localFile("..");
    const serverjs = localFile("../mongaku.js");
    const ignored = [
        path.join(localDir, "node_modules"),
        path.join(cwd, "node_modules"),
        path.join(localDir, "..", "static"),
        path.join(cwd, "static"),
    ].join(",");

    const devCmd = [
        getBinary("supervisor"),
        `-w ${localDir},${cwd}`,
        "-e js",
        `-i ${ignored}`,
        "--",
        serverjs,
    ]
        .concat(extraArgs)
        .join(" ");

    return shell.exec(devCmd, {async: true});
};

if (args.v || args.version) {
    console.log(pkg.version);
} else if (cmd === "start") {
    process.env.NODE_ENV = "production";

    const workers = args.workers || 2;
    const basePath = args.logs || "";
    const stdoutLog = path.resolve(basePath, "mongaku-stdout.log");
    const stderrLog = path.resolve(basePath, "mongaku-stderr.log");
    const serverjs = localFile("../mongaku.js");

    const startCmd = [
        getBinary("naught"),
        "start",
        `--worker-count ${workers}`,
        `--ipc-file mongaku.ipc`,
        `--pid-file mongaku.pid`,
        `--log /dev/null`,
        `--stdout ${stdoutLog}`,
        `--stderr ${stderrLog}`,
        serverjs,
    ]
        .concat(extraArgs)
        .join(" ");

    shell.exec(startCmd);
} else if (cmd === "stop") {
    shell.exec(
        `${getBinary("naught")} stop --pid-file mongaku.pid mongaku.ipc`,
    );
} else if (cmd === "restart") {
    shell.exec(`${getBinary("naught")} deploy mongaku.ipc`);
} else if (cmd === "build") {
    runBabel();
    runWebpack();
} else if (cmd === "build-watch") {
    runWebpack(true);
    runBabel(true);
} else if (cmd === "dev") {
    runSupervisor();
    runBabel(true);
    runWebpack(true);
} else if (cmd === "create" || cmd === "convert" || cmd === "i18n") {
    const [name] = extraArgs;

    const init = require("../lib/init");
    const logic = require(`../utils/${cmd}-${name}.js`);

    init(() => {
        logic(extraArgs.slice(1), err => {
            if (err) {
                console.error(err);
                process.exit(1);
            } else {
                process.exit(0);
            }
        });
    });
} else {
    console.log(
        `${pkg.name}: ${pkg.description}

usage: mongaku <command>

Commands:
    install
    create admin
    create user
    create source
    create index
    convert data
    start
      --logs
      --workers
    stop
    restart
    dev

-v: Show program version
-h: Show available commands
`,
    );
}
