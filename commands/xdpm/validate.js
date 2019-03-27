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

const path = require('path')
const getPluginMetadata = require('../../lib/getPluginMetadata')
const validate = require('../../lib/validate')

const {Command, flags} = require('@oclif/command')

/**
 * validates one or more plugins
 */
class ValidateCommand extends Command {
  async run() {
    const {flags, argv} = this.parse(ValidateCommand)

    const results = argv.map(pluginToValidate => {
      const sourcePath = path.resolve(pluginToValidate)
      const result = {
        path: sourcePath
      }

      const metadata = getPluginMetadata(sourcePath)
      if (!metadata) {
        return Object.assign({}, result, {
          'error': `Plugin ${pluginToValidate} doesn't have a manifest.`
        })
      }

      const errors = validate(metadata, { root: sourcePath })
      if (errors.length > 0) {
        return Object.assign({}, result, {
          'error': `Plugin ${pluginToValidate} has validation errors in the manifest.json:\n` + errors.join('\n')
        })
      }

      result.ok = `"${metadata.name}"@${metadata.version} [${metadata.id}] validated successfully`
      return result
    })

    if (flags.json) {
      this.log(JSON.stringify(results))
      return results
    }

    results.forEach(result => {
      if (result.ok) {
        this.log(result.ok)
      } else {
        this.error(result.error)
      }
    })

    return results
  }
}

ValidateCommand.description = `Validates a plugin's manifest to ensure that it will be accepted by XD.
...
`

ValidateCommand.args = [{
  name: 'srcPath',
  default: '.'
}]

ValidateCommand.strict = false

ValidateCommand.flags = {
  clean: flags.boolean({
    description: 'Clean before install',
    char: 'c',
    default: false
  }),
  json: flags.boolean({
    description: 'Generate JSON output',
    char: 'j',
    default: false
  }),
  overwrite: flags.boolean({
    description: 'Allow overwriting plugins',
    char: 'o',
    default: false
  }),
  which: flags.string({
    description: 'Which Adobe XD instance to target',
    char: 'w',
    multiple: false,
    options: ['release', 'prerelease', 'dev']
  })
}

module.exports = ValidateCommand
