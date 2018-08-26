#! /usr/bin/env node
const cli = require("cli");

cli.enable("status");

const commands = {
    "install": "Install a plugin",
    "ls": "List all plugins",
    "package": "Package a plugin",
    "watch": "Watch a plugin directory. If no directory is specified, `.` is assumed",
};

const options = {
    clean: ["c", "Clean before install", "bool", false],
    json: ["j", "If true, indicates that JSON output should be generated", "bool", false],
    mode: ["m", "Indicates which plugin mode to use (d=develop, p=production)", ["d", "p"], "d"],
    overwrite: ["o", "Allow overwriting plugins", "bool", false],
    which: ["w", "Which Adobe XD instance to target (r=release, p=prerelease, d=dev)", ["r", "p", "d"], "r"],
};

const parsedOpts = cli.parse(options, commands);

if (parsedOpts.json) {
    cli.status = function() {};
}

const { command, args } = cli;

switch (command.toLowerCase()) {
    case "ls":
        require("./commands/ls")(parsedOpts, args);
        break;
    case "install":
        require("./commands/install")(parsedOpts, args);
        break;
    case "watch":
        require("./commands/watch")(parsedOpts, args);
        break;
    case "package":
        require("./commands/package")(parsedOpts, args);
        break;
}
