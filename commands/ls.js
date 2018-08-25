const cli = require("cli");
const shell = require("shelljs");
const path = require("path");
const localXdPath = require("../lib/localXdPath");
const getPluginMetadata = require("../lib/getPluginMetadata");

function ls (opts, args) {
    const folder = localXdPath(opts);
    if (!folder) {
        console.fatal(`Could not determine Adobe XD folder.`);
    }
    cli.info(`Listing plugins inside ${folder}`);
    const folders = shell.ls("-d", path.join(folder, "*"));
    const plugins = folders.filter(pluginPath => {
        const base = path.basename(pluginPath);
        const metadata = getPluginMetadata(pluginPath);
        if (args.length > 0 && metadata && (!args.includes(base) && !args.includes(metadata.id))) {
            return false;
        }
        if (metadata && !opts.json) {
            cli.output(`${base}: "${metadata.name}"@${metadata.version} [${metadata.id}]`);
        }
        return !!metadata;
    });
    if (opts.json) {
        cli.output(JSON.stringify(plugins.map(pluginPath => ({
            path: pluginPath,
            metadata: getPluginMetadata(pluginPath)
        })), null, 2));
    }
    if (plugins.length === 0) {
        cli.error(`No valid plugins installed.`);
    }
}

module.exports = ls;