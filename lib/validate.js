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

const PLUGIN_NAME_MIN_LEN = 3;
const PLUGIN_NAME_MAX_LEN = 45;
const SUPPORTED_HOSTS = ["XD"];
const VERSION_REGEX = /^\d{1,2}\.\d{1,2}.\d{1,2}$/;
const MIN_VERSION = "0.0.1";
const MAX_VERSION = "99.99.99";

const fs = require("fs");
const path = require("path");

function validate(manifest, { root, id } = {}) {
    const errors = [];

    // check the ID
    if (!manifest.id) {
        errors.push("F1000: Manifest is missing a 'id' field. Add a plugin id.");
    } else {
        if (id) {
            if (manifest.id !== id) {
                errors.push (`F1001: Manifest 'id' does not match expected id. Saw '${manifest.id}', expected '${id}'`);
            }
        }
    }

    // check the name
    if (!manifest.name) {
        errors.push("F1010: Manifest is missing a plugin name.");
    } else {
        if (manifest.name.length < PLUGIN_NAME_MIN_LEN || manifest.name.length > PLUGIN_NAME_MAX_LEN) {
            errors.push(`F1011: Manifest name is not an appropriate length (expected ${PLUGIN_NAME_MIN_LEN} - ${PLUGIN_NAME_MAX_LEN} chars, saw ${manifest.name.length} chars).`);
        }
    }

    // check for a version
    if (!manifest.version) {
        errors.push("F1030: Manifest must specify a version number.");
    } else {
        if (!VERSION_REGEX.test(manifest.version)) {
            errors.push(`F1031: Version format is incorrect. Saw ${manifest.version}, expected ${MIN_VERSION} - ${MAX_VERSION}.`)
        }
    }

    // check for a host property
    if (!manifest.host) {
        errors.push("F1020: Manifest is missing host requirements. Add a 'host' key.");
    } else {
        // host.app
        if (!manifest.host.app) {
            errors.push("F1021: Manifest is missing host app id. Add a host.app key.");
        } else {
            // is the host app one we expect?
            if (!SUPPORTED_HOSTS.includes(manifest.host.app)) {
                errors.push(`F1022: Manifest host is not a recognized host. Saw ${manifest.host.app}, expected one of ${SUPPORTED_HOSTS.join()}`)
            }
        }

        // host.minVersion
        if (!manifest.host.minVersion) {
            errors.push("F1023: Manifest must specify the minimum supported host version.");
        } else {
            if (!VERSION_REGEX.test(manifest.host.minVersion)) {
                errors.push(`F1024: Host minimum version format is incorrect. Saw ${manifest.host.minVersion}, expected ${MIN_VERSION} - ${MAX_VERSION}.`)
            }
        }

        // host.maxVersion
        if (manifest.host.maxVersion) {
            if (!VERSION_REGEX.test(manifest.host.minVersion)) {
                errors.push(`F1025: Host maximum version format is incorrect. Saw ${manifest.host.maxVersion}, expected ${MIN_VERSION} - ${MAX_VERSION}.`)
            }
        }
    }

    // validate entry points (this is a bit lax ATM, but easy verifiable with XD)
    if (!manifest.uiEntryPoints) {
        errors.push("F1040: Manifest must contain UI entry points.");
    }

    // validate icons
    if (manifest.icons) {
        if (!Array.isArray(manifest.icons)) {
            errors.push("W2000: Icons should be an array.");
        } else {
            manifest.icons.forEach((icon, idx) => {
                if (!icon.width) {
                    errors.push(`W2001: Icon ${idx} should specify a width.`);
                }
                if (!icon.height) {
                    errors.push(`W2002: Icon ${idx} should specify a height.`);
                }
                if (icon.width && icon.height && icon.width !== icon.height) {
                    errors.push(`W2003: Icon ${idx} should be square.`);
                }
                if (!icon.path) {
                    errors.push(`W2004: Icon ${idx} should specify a path.`);
                }
                if (!fs.existsSync(path.join(root || '.', icon.path))) {
                    errors.push(`W2004: Icon ${idx} has path ${icon.path}, but no icon was found there.`);
                }
            });
        }
    }

    return errors;
}

module.exports = validate;