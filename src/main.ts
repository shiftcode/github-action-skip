import * as core from '@actions/core'
import * as git from '@actions/github'

const INPUT = 'skipOnCommitMsg'

async function run() {
  try {
    core.debug('start working')
    const skipOnCommitMsg = core.getInput(INPUT)
    console.log(`skip CI on commit message ${skipOnCommitMsg}`)

    const commitMessage = git.context.payload.head_commit.message
    console.log('commit message', commitMessage)
    if (commitMessage.includes(skipOnCommitMsg)) {
      core.setFailed(`stopping here, because the commit message contains the provided input <${skipOnCommitMsg}>`)
    }
  } catch (error) {
    if(error instanceof Error){
      core.setFailed(error.message)
    }
  }
}

run()
