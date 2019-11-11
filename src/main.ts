import * as core from '@actions/core'
import * as git from '@actions/github'

const INPUT = 'skipOnCommitMsg'

async function run() {
  try {
    core.debug('start working')
    const skipOnCommitMsg = core.getInput(INPUT)
    console.log(`skip CI on commit message ${skipOnCommitMsg}`)

    // core.startGroup('Expand to see the github context')
    console.log(JSON.stringify(git.context))
    // core.endGroup()
    
    const commitMessage = git.context.payload.head_commit.message
    if (commitMessage.includes(skipOnCommitMsg)) {
      core.setFailed(`stopping here, because the commit message contains the provided input <${skipOnCommitMsg}>`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
