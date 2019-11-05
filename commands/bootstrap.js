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

const dirname = "my-plugin";
const repo = "git@github.com:AdobeXD/plugin-samples.git";
const sampleDirs = {
  default: "quick-start",
  headless: "quick-start",
  panel: "quick-start-panel",
  react: "quick-start-react",
  modal: "ui-html"
}

function bootstrap(opts, args) {
  const sampleDir = sampleDirs[args[0] || "default"] || sampleDirs.default;

  if (!shell.which("git")) {
    shell.echo("Sorry, `xdpm bootstrap` requires git.");
    shell.exit(1);
  }

  // git clone from I/O console starter proj
  shell.exec(
    `git clone "${repo}" "${dirname}"`,
    function (code, stdout, stderr) {
      if (code === 0) {
        cleanupClone(sampleDir);
      } else {
        shell.echo("Failed to clone starter project.");
      }
    }
  );
}

function cleanupClone(sampleDir) {
  shell.cd(`./${dirname}`);
  shell.exec(`git filter-branch --subdirectory-filter "${sampleDir}"`);
  shell.rm("-rf", `.git`);
}

module.exports = {
  bootstrap,
  sampleDirs
};
