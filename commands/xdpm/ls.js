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

const shell = require('shelljs')
const path = require('path')
const {Command, flags} = require('@oclif/command')

const localXdPath = require('../../lib/localXdPath')
const getPluginMetadata = require('../../lib/getPluginMetadata')

class ListCommand extends Command {
  async run() {
    const {flags, argv} = this.parse(ListCommand)
    const folder = localXdPath({which: flags.which})
    if (!folder) {
      throw new Error('Could not determine Adobe XD folder.')
    }
    this.log(`Listing plugins inside ${folder}`)

    const folders = shell.ls('-d', path.join(folder, '*'))

    const plugins = folders.filter(pluginPath => {
      const base = path.basename(pluginPath)
      const metadata = getPluginMetadata(pluginPath)
      if (argv.length > 0 &&
          metadata && (!argv.includes(base) && !argv.includes(metadata.id))) {
        return false
      }
      if (metadata && !flags.json) {
        this.log(`${base}: "${metadata.name}"@${metadata.version} [${metadata.id}]`)
      }
      return metadata !== null
    })

    if (flags.json) {
      this.log(JSON.stringify(plugins.map(pluginPath => ({
        path: pluginPath,
        metadata: getPluginMetadata(pluginPath)
      })), null, 2))
    }

    if (plugins.length === 0) {
      this.error('No valid plugins installed.')
    }
  }
}

ListCommand.description = `Lists plugins installed in Adobe XD in development mode.
...
`
ListCommand.strict = false

ListCommand.flags = {
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

module.exports = ListCommand
