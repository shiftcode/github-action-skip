import * as core from '@actions/core'
import * as git from '@actions/github'

const INPUT = 'skipOnCommitMsg'

async function run() {
  try {
    core.debug('start working')
    const skipOnCommitMsg = core.getInput(INPUT)
    console.log(`skip CI on commit message ${skipOnCommitMsg}`)

    // console.log(JSON.stringify(git.context))

    switch(git.context.eventName){
      case 'pull_request':
        console.log('just proceed for pull request')
        break
      case 'push':
        const commitMessage = git.context.payload.head_commit.message
        if (commitMessage.includes(skipOnCommitMsg)) {
          core.setFailed(`stopping here, because the commit message contains the provided input <${skipOnCommitMsg}>`)
        }else{
          console.log('no need to skip the build')
        }
        break
      default:
        console.log(`no implementation for event type ${git.context.eventName}`)
    }

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
