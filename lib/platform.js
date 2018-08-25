const process = require("process");

let platform;
switch(process.platform) {
    case "darwin":
        platform = "mac";
        break;
    case "win32":
        platform = "win";
        break;
    default:
        platform = null;
}

if (!platform) {
    throw new Error("Unsupported platform; run on macOS or Windows.");
}

module.exports = platform;