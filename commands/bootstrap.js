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
const shell = require("shelljs");

const repo = "git@github.com:AdobeXD/plugin-samples.git";
const defaultDirname = "my-plugin";
const sampleDirs = {
  default: "quick-start",
  headless: "quick-start",
  panel: "quick-start-panel",
  react: "quick-start-react",
  modal: "ui-html"
};

function bootstrap(opts, args) {
  const sampleRepoDirname =
    sampleDirs[args[0] || "default"] || sampleDirs.default;
  const localDirname = checkName(args[1]) || defaultDirname;

  if (!shell.which("git")) {
    shell.echo("Sorry, `xdpm bootstrap` requires git.");
    shell.exit(1);
  }

  // Clone from repo
  shell.exec(`git clone "${repo}" "${localDirname}"`, function(
    code,
    stdout,
    stderr
  ) {
    if (code === 0) {
      cleanupClone(sampleRepoDirname, localDirname);
    } else {
      shell.echo("Failed to clone starter project.");
    }
  });
}

function checkName(dirname) {
  const unallowedChars = ['"', "'", ";"];
  const usedChars = unallowedChars.reduce((foundChars, char) => {
    if (dirname.includes(char)) foundChars.push(char);
    return foundChars;
  }, []);

  if (usedChars.length) {
    shell.echo(
      `Sorry, the following characters aren't allowed in your directory name: ${usedChars.join(
        " "
      )}`
    );
    shell.exit(1);
  }
  return dirname;
}

function cleanupClone(sampleRepoDirname, localDirname) {
  shell.cd(`./${localDirname}`);
  shell.exec(
    `git filter-branch --subdirectory-filter "${sampleRepoDirname}" >/dev/null 2>&1`
  );
  shell.rm("-rf", `.git`);
}

module.exports = {
  bootstrap,
  sampleDirs
};
