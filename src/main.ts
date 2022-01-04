import * as core from '@actions/core'
import * as github from '@actions/github'

enum INPUT_PARAMS{
  SKIP_ON_COMMIT_MSG = 'skipOnCommitMsg',
  GH_TOKEN = 'githubToken'
}

enum OUTPUT_PARAMS{
  SHOULD_EXECUTE = 'shouldExecute'
}

async function run() {
  try {
    const skipOnCommitMsg = core.getInput(INPUT_PARAMS.SKIP_ON_COMMIT_MSG)
    const ghToken = core.getInput(INPUT_PARAMS.GH_TOKEN)

    core.debug(`reading git commit message to resolve the output variable, output variable will be true if commit message contains message "${skipOnCommitMsg}"`)

    const octokit = github.getOctokit(ghToken)
    octokit.rest

    const {eventName, sha} = github.context
    core.info(`event name: ${eventName}`)
    core.info(`sha: ${sha}`)
    if(sha){
      const q = encodeURIComponent(`hash:${sha}`)
      core.info(`q: ${q}`,)
      const commit = await octokit.rest.search.commits({q})
      core.info(`count of commits ${commit.data.total_count}`)
      core.info(`message: ${commit.data.items[0].commit.message}`)
      if(true){
        core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, true)
        return
      }
    }

      core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, false)
  } catch (error) {
    core.error('there was an error')
    if(error instanceof Error){
      core.setFailed(error.message)
    }

    try{
      core.setFailed(JSON.stringify(error))
    }catch (err){
      core.setFailed(`there was an error, can't print JSON.stringify failed`)
    }
  }
}

run()
