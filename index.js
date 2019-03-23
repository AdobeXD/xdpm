#! /usr/bin/env node
/*
 * Copyright 2018 Adobe Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const cli = require("cli");
const package = require("./package.json");

cli.enable("status");

const commands = {
  install: "Install a plugin in development mode",
  ls: "List all plugins in development mode",
  package: "Package a plugin",
  validate: "Validate a plugin's manifest",
  watch:
    "Watch a plugin directory. If no directory is specified, `.` is assumed"
};

const options = {
  clean: ["c", "Clean before install", "bool", false],
  json: [
    "j",
    "If true, indicates that JSON output should be generated",
    "bool",
    false
  ],
  //  mode: ["m", "Indicates which plugin mode to use", ["d", "p"], "d"],
  overwrite: ["o", "Allow overwriting plugins", "bool", false],
  which: [
    "w",
    "Which Adobe XD instance to target",
    ["r", "p", "d", "release", "pre", "prerelease", "dev", "development"],
    "r"
  ],
  autoreload: ["a", "Automatically reload all plugins", "bool", false],
  autoexec: ["x", "Automatically execute a plugin command", "string", ""],
  autoundo: ["u", "Automatically run undo for a plugin command", "string", ""]
};

const parsedOpts = cli.parse(options, commands);

if (parsedOpts.json) {
  cli.status = function() {};
} else {
  cli.info(`xdpm ${package.version} - XD Plugin Manager CLI`);
  cli.info(`Use of this tool means you agree to the Adobe Terms of Use at
https://www.adobe.com/legal/terms.html and the Developer Additional
Terms at https://wwwimages2.adobe.com/content/dam/acom/en/legal/servicetou/Adobe-Developer-Additional-Terms_en_US_20180605_2200.pdf.`);
}

const { command, args } = cli;

if (parsedOpts.which) {
  parsedOpts.which = parsedOpts.which[0];
}

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
  case "validate":
    require("./commands/validate")(parsedOpts, args);
    break;
}
