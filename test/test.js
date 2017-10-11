'use strict'

const assert = require('chai').assert
const fs = require('fs')
const exec = require('child_process').exec
//const spawn = require('child_process').spawn
const osPlatform = require('os').platform()


/*function getOS() {
  let osName = ''
  switch (os.type()) {
    case 'Darwin':
      osName = 'macos'
      break
    case 'win32':
      osName = 'win'
      break
    default:
      osName = 'linux'
      break
  }
  return osName
}*/


describe('Build binary with pkg', function(done) {
  this.timeout(60000)
  before(function(done) {
    exec('npm run dist', (err, stdout, stderr) => {
      assert.equal(err, null, `Binary build failed: ${err}`)
      done()
    })
  })

  let targets = ['linux', 'macos', 'win.exe']
  targets.forEach(function(target) {
    it(`Build ${target}`, function(done) {
      let binaryFile = `./bin/socket-chat-example-${target}`
      fs.stat(binaryFile, function(err, stats) {
        assert.equal(err, null, `binary file not produced, ${binaryFile}`)
        done()
      })
    })
  })
})

describe('Random test', function(done) {
  it('to accomplish nothing', function(done) {
    assert.equal(1 + 1, 2)
    done()
  })
})

describe('Build installer with wix', function(done) {
  this.timeout(60000)
  if (osPlatform == 'win32') {
    before(function(done) {
      exec('npm run wix', (err, stdout, stderr) => {
        assert.equal(err, null, 'Installer build failed')
        assert.equal(stderr, '', 'stderr exists from pkg')
        done()
      })
    })

    //let targets = ['linux', 'macos', 'win.exe']
    it(`Build .msi`, function(done) {
      let msiFile = `./Wix/chatAppInstaller.msi`
      fs.stat(msiFile, function(err, stats) {
        assert.equal(err, null, `.msi installer not generated, ${msiFile}`)
        done()
      })
    })
  } else {
    console.log(`Wix tests not applicable to ${osPlatform}`)
  }
})
