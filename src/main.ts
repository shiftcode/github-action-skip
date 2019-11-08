import * as core from '@actions/core'
import * as git from '@actions/github'

const INPUT = 'skipOnCommitMsg'

async function run() {
  try {
    core.debug('start working')
    const skipOnCommitMsg = core.getInput(INPUT)
    console.log(`skip CI on commit message ${skipOnCommitMsg}`)

    console.log(JSON.stringify(git.context))

    core.setFailed('skip CI')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
