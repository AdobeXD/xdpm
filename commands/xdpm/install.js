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
const fs = require('fs')
const mkdirp = require('mkdirp')

const localXdPath = require('../../lib/localXdPath')
const getPluginMetadata = require('../../lib/getPluginMetadata')
const ignoreWalk = require('ignore-walk')
const filterAlwaysIgnoredFile = require('../../lib/filterAlwaysIgnoredFile')

const { Command, flags } = require('@oclif/command')

/**
 * Installs one or more plugins.
 */
class InstallCommand extends Command {
  async run () {
    const { flags, argv } = this.parse(InstallCommand)
    const folder = localXdPath({ which: flags.which })
    if (!folder) {
      throw new Error('Could not determine Adobe XD folder.')
    }

    const results = argv.map(pluginToInstall => {
      const sourcePath = path.resolve(pluginToInstall)
      const result = {
        path: sourcePath
      }

      const metadata = getPluginMetadata(sourcePath)
      if (!metadata) {
        return Object.assign({}, result, {
          'error': 'Can\'t install a plugin that doesn\'t have a valid manifest.json'
        })
      }

      const id = metadata.id
      if (!id) {
        return Object.assign({}, result, {
          'error': 'Can\'t install a plugin without a plugin ID in the manifest'
        })
      }

      const rootFolder = folder

      const targetFolder = path.join(rootFolder, id)
      if (fs.existsSync(targetFolder)) {
        if (!flags.overwrite) {
          return Object.assign({}, result, {
            'error': 'Plugin exists already; use -o to overwrite'
          })
        }
        if (flags.clean) {
          this.log(`(Cleaning) Removing files inside ${targetFolder}`)
          // TODO: use fs-extra fs.removeSync
          shell.rm('-Rf', path.join(targetFolder, '*'))
        }
      } else {
        fs.mkdir(targetFolder)
      }

      // the comment below doesn't respect .xdignore (or other ignore files)
      // but this is the gist of what we're trying to accomplish
      // shell.cp("-R", path.join(sourcePath, "*"), targetFolder)

      const files = ignoreWalk.sync({
        path: sourcePath,
        ignoreFiles: ['.gitignore', '.xdignore', '.npmignore'],
        includeEmpty: false
      }).filter(filterAlwaysIgnoredFile)

      files.forEach(file => {
        const srcFile = path.join(sourcePath, file)
        const tgtFile = path.join(targetFolder, file)
        const tgtDir = path.dirname(tgtFile)
        if (!fs.existsSync(tgtDir)) {
          mkdirp.sync(tgtDir)
        }
        shell.cp(srcFile, tgtFile)
      })
      return Object.assign({}, result, {
        ok: `"${metadata.name}"@${metadata.version} [${metadata.id}] installed successfully.`
      })
    })

    if (flags.json) {
      return results
    }

    results.forEach(result => {
      if (result.ok) {
        this.log('ok:' + result.ok)
      } else {
        this.error(result.error)
      }
    })
    return results
  }
}

InstallCommand.description = `Copy one or more plugins in a develoment folder into Adobe XD's develop folder

Install an XD plugin in development mode
`

InstallCommand.args = [{
  name: 'srcPath',
  default: '.'
}]

InstallCommand.strict = false

InstallCommand.flags = {
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
module.exports = InstallCommand
