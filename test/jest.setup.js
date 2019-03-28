const { stdout } = require('stdout-stderr')
const fs = require.requireActual('fs')
const eol = require('eol')

jest.setTimeout(30000)
jest.useFakeTimers()

// dont touch the real fs
jest.mock('fs', () => require('jest-plugin-fs/mock'))

// trap console log
beforeEach(() => { stdout.start() })
afterEach(() => { stdout.stop() })

// helper for fixtures
global.fixtureFile = (output) => {
  return fs.readFileSync(`./test/__fixtures__/${output}`).toString()
}

// helper for fixtures
global.fixtureJson = (output) => {
  return JSON.parse(fs.readFileSync(`./test/__fixtures__/${output}`).toString())
}

// helper for zip fixtures
global.fixtureZip = (output) => {
  return fs.readFileSync(`./test/__fixtures__/${output}`)
}

// set the fake filesystem
const ffs = require('jest-plugin-fs').default
global.fakeFileSystem = {
  addJson: (json) => {
    // add to existing
    ffs.mock(json)
  },
  removeKeys: (arr) => {
    // remove from existing
    const files = ffs.files()
    for (let prop in files) {
      if (arr.includes(prop)) {
        delete files[prop]
      }
    }
    ffs.restore()
    ffs.mock(files)
  },
  clear: () => {
    // reset to empty
    ffs.restore()
  },
  files: () => {
    return ffs.files()
  }
}
// seed the fake filesystem
fakeFileSystem.clear()

global.createTestBaseFlagsFunction = (TheCommand, BaseCommand) => {
  return global.createTestFlagsFunction(TheCommand, BaseCommand.flags)
}

global.createTestFlagsFunction = (TheCommand, Flags) => {
  return () => {
    // every command needs to override .flags (for global flags)
    expect(TheCommand.hasOwnProperty('flags')).toBeTruthy()

    const flagsKeys = Object.keys(Flags)
    const theCommandFlagKeys = Object.keys(TheCommand.flags)

    // every command needs to include the global flags (through object spread)
    expect(flagsKeys.every(k => theCommandFlagKeys.includes(k))).toBeTruthy()
  }
}

// fixture matcher
expect.extend({
  toMatchFixture (received, argument) {
    let val = fixtureFile(argument)
    expect(eol.auto(received)).toEqual(eol.auto(val))
    return { pass: true }
  }
})

expect.extend({
  toMatchFixtureJson (received, argument) {
    let val = fixtureJson(argument)
    expect(received).toEqual(val)
    return { pass: true }
  }
})
