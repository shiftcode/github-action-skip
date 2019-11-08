import * as core from '@actions/core'
import * as git from '@actions/github'

const INPUT = 'skipOnCommitMsg'

async function run() {
  try {
    const skipOnCommitMsg = core.getInput(INPUT)
    // git.GitHub.
    core.debug(JSON.stringify(git.context))
    console.log(`skip CI on commit message ${skipOnCommitMsg}`)

    core.setFailed('skip CI')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
