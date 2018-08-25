const cli = require("cli");
const path = require("path");
const localXdPath = require("../lib/localXdPath");
const getPluginMetadata = require("../lib/getPluginMetadata");
const chokidar = require("chokidar");
const debounce = require("debounce");

const install = require("./install");

/**
 * Watches for changes in one or more plugins and re-installs them automatically
 */
function watch (opts, args) {
    const folder = localXdPath(opts);
    if (!folder) {
        console.fatal(`Could not determine Adobe XD folder.`);
        return;
    }

    if (args.length === 0) {
        args.push("."); // assume we want to install the plugin in the cwd
    }

    if (opts.json) {
        // this doesn't make sense!
        cli.output(JSON.stringify({"error": "Can't use JSON output on watch."}));
        return;
    }

    opts.overwrite = true; // watch will always have to overwrite target plugins. Sorry.

    const results = args.map(pluginToWatch => {
        const sourcePath = path.resolve(pluginToWatch);
        const result = {
            path: sourcePath
        };

        const metadata = getPluginMetadata(sourcePath);
        if (!metadata) {
            return Object.assign({}, result, {
                "error": "Can't watch a plugin that doesn't have a valid manifest.json"
            });
        }

        const id = metadata.id;
        if (!id) {
            return Object.assign({}, result, {
                "error": "Can't watch a plugin without a plugin ID in the manifest"
            });
        }

        const watcher = chokidar.watch(sourcePath, {
            ignored: /node_modules/,
            cwd: sourcePath,
            persistent: true
        });

        watcher.on("all", debounce(() => {
            cli.info(`${metadata.name} changed; reinstalling...`);
            install(opts, [ pluginToWatch ]); // only want to reinstall the changed plugin
        }, 250));

        return Object.assign({}, result, {
            "ok": `Watching ${metadata.name}...`
        });
    });

    results.forEach(result => {
        if (result.ok) {
            cli.info(result.ok);
        } else {
            cli.error(result.error);
        }
    });

    cli.info(`Watching... press BREAK (CTRL+C) to exit.`)
}

module.exports = watch;