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
const PLUGIN_DESC_MIN_LEN = 3;
const PLUGIN_DESC_MAX_LEN = 1000;
const PLUGIN_SUMMARY_MIN_LEN = 3;
const PLUGIN_SUMMARY_MAX_LEN = 30;
const RELEASE_NOTES_MIN_LEN = 3;
const RELEASE_NOTES_MAX_LEN = 1000;
const AUTHOR_MIN_LEN = 3;
const AUTHOR_MAX_LEN = 40;
const KEYWORD_MIN_LEN = 2;
const KEYWORD_CONCAT_MAX_LEN = 100;
const SUPPORTED_HOSTS = ["XD"];
const SUPPORTED_LANGUAGES = ["en", "de", "fr", "ja", "ko", "zh", "es", "pt"];
const PLUGIN_VERSION_REGEX = /^\d{1,2}\.\d{1,2}.\d{1,2}$/;
const HOST_VERSION_REGEX = /^\d{1,2}\.\d{1,2}$/;
const PLUGIN_MIN_VERSION = "0.0.1";
const PLUGIN_MAX_VERSION = "99.99.99";
const HOST_MIN_VERSION = "13.0";
const HOST_MAX_VERSION = "99.99";

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
        errors.push(
          `F1001: Manifest 'id' does not match expected id. Saw '${
            manifest.id
          }', expected '${id}'.`
        );
      }
    }
    if (manifest.id.length !== 8) {
      errors.push(
        `F1002: Manifest 'id' character count is incorrect. Count is ${
          manifest.id.length
        }, expected 8.`
      );
    }
  }

  // check the name
  if (!manifest.name) {
    errors.push("F1010: Manifest is missing a plugin name.");
  } else {
    if (
      manifest.name.length < PLUGIN_NAME_MIN_LEN ||
      manifest.name.length > PLUGIN_NAME_MAX_LEN
    ) {
      errors.push(
        `F1011: Manifest name is not an appropriate length (expected ${PLUGIN_NAME_MIN_LEN} - ${PLUGIN_NAME_MAX_LEN} chars, saw ${
          manifest.name.length
        } chars).`
      );
    }
  }

  // check for a version
  if (!manifest.version) {
    errors.push("F1030: Manifest must specify a version number.");
  } else {
    if (!PLUGIN_VERSION_REGEX.test(manifest.version)) {
      errors.push(
        `F1031: Version format is incorrect. Saw ${
          manifest.version
        }, expected ${PLUGIN_MIN_VERSION} - ${PLUGIN_MAX_VERSION}.`
      );
    }
  }

  // check for a host property
  if (!manifest.host) {
    errors.push(
      "F1020: Manifest is missing host requirements. Add a 'host' key."
    );
  } else {
    // host.app
    if (!manifest.host.app) {
      errors.push(
        "F1021: Manifest is missing host app id. Add a host.app key."
      );
    } else {
      // is the host app one we expect?
      if (!SUPPORTED_HOSTS.includes(manifest.host.app)) {
        errors.push(
          `F1022: Manifest host is not a recognized host. Saw ${
            manifest.host.app
          }, expected one of ${SUPPORTED_HOSTS.join()}`
        );
      }
    }

    // host.minVersion
    if (!manifest.host.minVersion) {
      errors.push(
        "F1023: Manifest must specify the minimum supported host version."
      );
    } else {
      if (!HOST_VERSION_REGEX.test(manifest.host.minVersion)) {
        errors.push(
          `F1024: Host minimum version format is incorrect. Saw ${
            manifest.host.minVersion
          }, expected ${HOST_MIN_VERSION} - ${HOST_MAX_VERSION}.`
        );
      }
    }

    // host.maxVersion
    if (manifest.host.maxVersion) {
      if (!HOST_VERSION_REGEX.test(manifest.host.minVersion)) {
        errors.push(
          `F1025: Host maximum version format is incorrect. Saw ${
            manifest.host.maxVersion
          }, expected ${HOST_MIN_VERSION} - ${HOST_MAX_VERSION}.`
        );
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
        if (!fs.existsSync(path.join(root || ".", icon.path))) {
          errors.push(
            `W2004: Icon ${idx} has path ${
              icon.path
            }, but no icon was found there.`
          );
        }
      });
    }
  }

  // validate description
  if (!manifest.description) {
    errors.push("F1050: Manifest must contain a plugin description.");
  } else {
    if (
      manifest.description.length < PLUGIN_DESC_MIN_LEN ||
      manifest.description.length > PLUGIN_DESC_MAX_LEN
    ) {
      errors.push(
        `F1051: Manifest description is not an appropriate length (expected ${PLUGIN_DESC_MIN_LEN} - ${PLUGIN_DESC_MAX_LEN} chars, saw ${
          manifest.description.length
        } chars).`
      );
    }
  }

  // validate summary
  if (!manifest.summary) {
    errors.push("F1060: Manifest must contain a plugin summary.");
  } else {
    if (
      manifest.summary.length < PLUGIN_SUMMARY_MIN_LEN ||
      manifest.summary.length > PLUGIN_SUMMARY_MAX_LEN
    ) {
      errors.push(
        `F1051: Manifest description is not an appropriate length (expected ${PLUGIN_SUMMARY_MIN_LEN} - ${PLUGIN_SUMMARY_MAX_LEN} chars, saw ${
          manifest.summary.length
        } chars).`
      );
    }
  }

  // validate keywords
  if (manifest.keywords) {
    if (!Array.isArray(manifest.keywords)) {
      errors.push("W2010: Keywords should be an array.");
    } else {
      // check if each keyword meets length requirements
      const concatKeywords = manifest.keywords.reduce((initVal, keyword) =>
        keyword.length >= KEYWORD_MIN_LEN
          ? initVal + keyword
          : errors.push(
              `W2011: Keywords should be at least ${KEYWORD_MIN_LEN} chars. Found keyword ${keyword} with ${
                keyword.length
              } chars.`
            )
      );

      // check if concatenated keywords meets length requirements
      if (concatKeywords.length > KEYWORD_CONCAT_MAX_LEN) {
        errors.push(
          `W2012: Concatenated length of all keywords should be no more than ${KEYWORD_CONCAT_MAX_LEN} chars. Found ${
            concatKeywords.length
          } chars.`
        );
      }
    }
  }

  // validate release notes
  if (manifest.releaseNotes) {
    if (
      manifest.releaseNotes.length < RELEASE_NOTES_MIN_LEN ||
      manifest.releaseNotes.length > RELEASE_NOTES_MAX_LEN
    ) {
      errors.push(
        `W2020: Release notes are not an appropriate length (expected ${RELEASE_NOTES_MIN_LEN} - ${RELEASE_NOTES_MAX_LEN} chars, saw ${
          manifest.releaseNotes.length
        } chars).`
      );
    }
  }

  // validate keywords
  if (!manifest.languages) {
    errors.push("F1070: Manifest must contain supported languages.");
  } else {
    if (!Array.isArray(manifest.languages) || manifest.languages.length === 0) {
      errors.push(
        "F1071: Languages should be an array with at least one element."
      );
    } else {
      // check if each keyword meets length requirements
      manifest.languages.map(lang =>
        SUPPORTED_LANGUAGES.includes(lang)
          ? lang
          : errors.push(
              `Unsupported language code "${lang}" found. \nOnly these language codes are supported: ${SUPPORTED_LANGUAGES.join(
                ", "
              )}.`
            )
      );
    }
  }

  if (!manifest.author) {
    errors.push("F1080: Manifest must contain author.");
  } else {
    if (
      manifest.author.length < AUTHOR_MIN_LEN ||
      manifest.author.length > AUTHOR_MAX_LEN
    ) {
      errors.push(
        `F1081: Author is not an appropriate length (expected ${AUTHOR_MIN_LEN} - ${AUTHOR_MAX_LEN} chars, saw ${
          manifest.author.length
        } chars).`
      );
    }
  }

  return errors;
}

module.exports = validate;
