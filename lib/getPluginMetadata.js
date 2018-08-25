const cli = require("cli");
const fs = require("fs");
const path = require("path");

function getPluginMetadata(pluginPath) {
    const manifestPath = path.join(pluginPath, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
        cli.debug(`${pluginPath} does not seem to be a valid plugin (no manifest)`);
        return null; // this path isn't a valid plugin folder
    }
    const json = fs.readFileSync(manifestPath, { encoding: "utf8"} );
    try {
        const metadata = JSON.parse(json);
        return metadata;
    } catch(err) {
        cli.debug(`${pluginPath} does not contain a valid manifest.`);
        return null; // manifest is invalid, nothing to return
    }
}

module.exports = getPluginMetadata;