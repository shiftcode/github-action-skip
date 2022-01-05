const {runningOnCI} = require('@shiftcode/build-helper')

if (!runningOnCI()) {
  console.log('install husky hooks')
  require('husky').install()
}else{
  console.log(`won't install husky hooks since running in github action`)
}