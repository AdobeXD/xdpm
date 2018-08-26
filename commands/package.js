const cli = require("cli");
const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const localXdPath = require("../lib/localXdPath");
const getPluginMetadata = require("../lib/getPluginMetadata");

const yazl = require("yazl");
const ignoreWalk = require("ignore-walk");

/**
 * Packages one or more plugins
 */
function package(opts, args) {

    if (args.length === 0) {
        args.push("."); // assume we want to package the plugin in the cwd
    }

    const results = args.map(pluginToPackage => {
        const sourcePath = path.resolve(pluginToPackage);
        const result = {
            path: sourcePath
        };

        const metadata = getPluginMetadata(sourcePath);
        if (!metadata) {
            return Object.assign({}, result, {
                "error": "Can't package a plugin that doesn't have a valid manifest.json"
            });
        }

        const id = metadata.id;
        if (!id) {
            return Object.assign({}, result, {
                "error": "Can't package a plugin without a plugin ID in the manifest"
            });
        }

        result.targetZip = path.join(sourcePath, '..', path.basename(sourcePath) + ".xdx");

        const zipfile = new yazl.ZipFile();

        zipfile.outputStream.pipe(fs.createWriteStream(result.targetZip)).on("close", function() {
        });

        const files = ignoreWalk.sync({
            path: sourcePath,
            ignoreFiles: [".gitignore", ".xdignore", ".npmignore"],
            includeEmpty: false,
        });

        files.forEach(file => {
            zipfile.addFile(path.join(sourcePath, file), file);
        });


        zipfile.end();

        result.ok = `"${metadata.name}"@${metadata.version} [${metadata.id}] packaged successfully at ${result.targetZip}`;
        return result;
    });

    if (opts.json) {
        return results;
    }

    results.forEach(result => {
        if (result.ok) {
            cli.ok(result.ok);
        } else {
            cli.error(result.error);
        }
    });

    return results;
}

module.exports = package;