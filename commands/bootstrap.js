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

const fs = require("fs");
const path = require("path");
const shell = require("shelljs");

const dirname = "my-plugin";
const fileNames = [
  "CODE_OF_CONDUCT.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "PULL_REQUEST_TEMPLATE.md",
  "COPYRIGHT",
  "ISSUE_TEMPLATE.md"
];

function bootstrap(opts, args) {
  if (!shell.which("git")) {
    shell.echo("Sorry, `xdpm bootstrap` requires git.");
    shell.exit(1);
  }

  // git clone from I/O console starter proj
  shell.exec(
    `git clone git@github.com:AdobeXD/io-console-starter-project.git ${dirname}`,
    function(code, stdout, stderr) {
      if (code === 0) {
        cleanupClone();
      } else {
        shell.echo("Failed to clone starter project.");
      }
    }
  );
}

function cleanupClone() {
  const dirpath = path.resolve(`./${dirname}/`);

  fileNames.forEach(filename => {
    fs.unlink(`${dirpath}/${filename}`, err => {
      if (err) {
        shell.echo("err");
        shell.exit(1);
      }
    });
  });

  shell.rm("-rf", `${dirpath}/.git`);
}

module.exports = bootstrap;
