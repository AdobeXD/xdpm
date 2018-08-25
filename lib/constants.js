const path = require ("path");
const os = require("os");

const home = os.homedir();

module.exports = {
    FOLDERS: {
        "mac": {
            "r": path.join(home, "Library", "Application Support", "Adobe", "Adobe XD CC"),
            "p": path.join(home, "Library", "Application Support", "Adobe", "Adobe XD CC (Prerelease)"),
            "d": path.join(home, "Library", "Application Support", "Adobe", "Adobe XD CC (Dev)")
        },
        "win": {
            "r": path.join(home, "AppData", "Local", "Packages", "Adobe.CC.XD.adky2gkssdxte", "LocalState"),
            "p": path.join(home, "AppData", "Local", "Packages", "Adobe.CC.XD.Prerelease_adky2gkssdxte", "LocalState"),
            "d": path.join(home, "AppData", "Local", "Packages", "Adobe.CC.XD.Dev_adky2gkssdxte", "LocalState")
        }
    },
    MODES: {
        "d": "develop",
        "p": "plugins"
    },
    WHICH: {
        "r": "release",
        "p": "prerelease",
        "d": "dev"
    }
};