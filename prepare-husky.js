const { isGithubWorkflow } = require('@shiftcode/branch-utilities')

if (isGithubWorkflow(process.env)) {
  console.log(`won't install husky hooks since running in github action`)
} else {
  console.log('install husky hooks')
  require('husky').install()
}
