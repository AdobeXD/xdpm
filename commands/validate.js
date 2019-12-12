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
const path = require("path");
const getPluginMetadata = require("../lib/getPluginMetadata");
const validate = require("../lib/validate");

/**
 * validates one or more plugins
 */
function validatePlugin(opts, args) {
    if (args.length === 0) {
        args.push("."); // assume we want to package the plugin in the cwd
    }

    const results = args.map(pluginToValidate => {
        const sourcePath = path.resolve(pluginToValidate);
        const result = {
            path: sourcePath
        };

        const metadata = getPluginMetadata(sourcePath);
        if (!metadata) {
            return Object.assign({}, result, {
                error: `Plugin ${pluginToValidate} doesn't have a manifest.`
            });
        }

        const errors = validate(metadata, { root: sourcePath });
        if (errors.length > 0) {
            return Object.assign({}, result, {
                error:
                    `Plugin ${pluginToValidate} has validation errors in the manifest.json:\n` +
                    errors.join("\n")
            });
        }

        result.ok = `"${metadata.name}"@${metadata.version} [${metadata.id}] validated successfully`;
        return result;
    });

    if (opts.json) {
        cli.output(JSON.stringify(results));
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

module.exports = validatePlugin;
