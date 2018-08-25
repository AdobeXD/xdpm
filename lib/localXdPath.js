const cli = require("cli");
const platform = require("./platform.js");
const { FOLDERS, MODES, WHICH } = require("./constants.js");

const path = require("path");
const fs = require("fs");

function localXdPath({which = "r", mode="d"} = {}) {

    const folderRoot = path.resolve(FOLDERS[platform][which], ".");
    const folder = path.resolve(folderRoot, MODES[mode]);

    if (!fs.existsSync(folderRoot)) {
        cli.fatal(`Could not locate ${folderRoot}. Do you have the ${WHICH[which]} version of Adobe XD CC installed?`);
        return;
    }

    if (!fs.existsSync(folder)) {
        // folder doesn't exist. Go ahead and create it.
        try {
            fs.mkdirSync(folder);
        } catch(err) {
            cli.fatal(`Could not create ${folder}. Check that you have permissions.`);
        }
    }

    return folder;
}

module.exports = localXdPath;