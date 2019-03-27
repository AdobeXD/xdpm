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

const chokidar = require('chokidar')
const debounce = require('debounce')

const {Command, flags} = require('@oclif/command')

const localXdPath = require('../../lib/localXdPath')
const getPluginMetadata = require('../../lib/getPluginMetadata')
const InstallCommand = require('./install')

/**
 * Watches for changes in one or more plugins and re-installs them automatically
 */
class WatchCommand extends Command {
  async run() {
    const {flags, argv} = this.parse(WatchCommand)
    const folder = localXdPath(flags.which)
    if (!folder) {
      this.error('Could not determine Adobe XD folder.')
      return
    }

    // watch will always have to overwrite target plugins. Sorry.
    flags.overwrite = true

    const results = argv.map(pluginToWatch => {
      const sourcePath = path.resolve(pluginToWatch)
      const result = {
        path: sourcePath
      }

      const metadata = getPluginMetadata(sourcePath)
      if (!metadata) {
        return Object.assign({}, result, {
          'error': "Can't watch a plugin that doesn't have a valid manifest.json"
        })
      }

      const id = metadata.id
      if (!id) {
        return Object.assign({}, result, {
          'error': "Can't watch a plugin without a plugin ID in the manifest"
        })
      }

      const watcher = chokidar.watch(sourcePath, {
        ignored: /node_modules/,
        cwd: sourcePath,
        persistent: true
      })

      watcher.on('all', debounce(() => {
        this.log(`${metadata.name} changed; reinstalling...`)
        let install = new InstallCommand()
        // TODO!
        // install.run()
        // install(opts, [pluginToWatch]) // only want to reinstall the changed plugin
      }, 250))

      return Object.assign({}, result, {
        'ok': `Watching ${metadata.name}...`
      })
    })

    results.forEach(result => {
      if (result.ok) {
        this.info(result.ok)
      } else {
        this.error(result.error)
      }
    })

    this.log('Watching... press BREAK (CTRL+C) to exit.')
  }
}

WatchCommand.description = `Watches a plugin folder and copies it into Adobe XD whenever the contents change
...
`

WatchCommand.args = [{
  name: 'srcPath',
  default: '.'
}]
WatchCommand.strict = false

WatchCommand.flags = {
  which: flags.string({
    description: 'Which Adobe XD instance to target',
    char: 'w',
    multiple: false,
    options: ['release', 'prerelease', 'dev']
  })
}

module.exports = WatchCommand
