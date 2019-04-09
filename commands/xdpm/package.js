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
const fs = require('fs')

const getPluginMetadata = require('../../lib/getPluginMetadata')
const validate = require('../../lib/validate')

const yazl = require('yazl')
const ignoreWalk = require('ignore-walk')
const filterAlwaysIgnoredFile = require('../../lib/filterAlwaysIgnoredFile')

const { Command, flags } = require('@oclif/command')

/**
 * Packages one or more plugins
 */
class PackageCommand extends Command {
  async run () {
    const { flags, argv } = this.parse(PackageCommand)

    const results = argv.map(pluginToPackage => {
      const sourcePath = path.resolve(pluginToPackage)
      const result = {
        path: sourcePath
      }

      const metadata = getPluginMetadata(sourcePath)
      if (!metadata) {
        return Object.assign({}, result, {
          'error': "Can't package a plugin that doesn't have a valid manifest.json"
        })
      }

      const errors = validate(metadata, { root: sourcePath })
      if (errors.length > 0) {
        return Object.assign({}, result, {
          'error': "Can't package a plugin that has validation errors in the maniest.json:\n" + errors.join('\n')
        })
      }

      const id = metadata.id
      if (!id) {
        return Object.assign({}, result, {
          'error': "Can't package a plugin without a plugin ID in the manifest"
        })
      }

      result.targetZip = path.join(sourcePath, '..', path.basename(sourcePath) + '.xdx')

      const zipfile = new yazl.ZipFile()

      zipfile.outputStream.pipe(fs.createWriteStream(result.targetZip))
        .on('close', function () { /* todo maybe? */ })

      const files = ignoreWalk.sync({
        path: sourcePath,
        ignoreFiles: ['.gitignore', '.xdignore', '.npmignore'],
        includeEmpty: false
      }).filter(filterAlwaysIgnoredFile)

      files.forEach(file => {
        zipfile.addFile(path.join(sourcePath, file), file)
      })

      zipfile.end()

      result.ok = `"${metadata.name}"@${metadata.version} [${metadata.id}] packaged successfully at ${result.targetZip}`
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

PackageCommand.description = `Packages a plugin folder into an xdx file suitable for distribution
...
`
// allow variadic args
PackageCommand.strict = false

// this gives an easy default
PackageCommand.args = [{
  name: 'dir',
  default: '.'
}]

PackageCommand.flags = {
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

module.exports = PackageCommand
