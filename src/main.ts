import * as core from '@actions/core'
import * as github from '@actions/github'

enum INPUT_PARAMS{
  SKIP_ON_COMMIT_MSG = 'skipOnCommitMsg',
  GH_TOKEN = 'githubToken'
}
async function run() {
  try {
    const skipOnCommitMsg = core.getInput(INPUT_PARAMS.SKIP_ON_COMMIT_MSG)
    const ghToken = core.getInput(INPUT_PARAMS.GH_TOKEN)

    core.debug(`reading git commit message to resolve the output variable, output variable will be true if commit message contains message "${skipOnCommitMsg}"`)

    const octokit = github.getOctokit(ghToken)
    octokit.rest

    if(true){
      core.setOutput('shouldExecute', false)
    } else {
      core.setOutput('shouldExecute', true)
    }
  } catch (error) {
    core.error('there was an error')
    if(error instanceof Error){
      core.setFailed(error.message)
    }

    core.setFailed(error)
  }
}

run()
