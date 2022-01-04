import * as core from '@actions/core'
import * as github from '@actions/github'

enum INPUT_PARAMS {
  SKIP_ON_COMMIT_MSG = 'skipOnCommitMsg',
  GH_TOKEN = 'githubToken'
}

enum OUTPUT_PARAMS {
  SHOULD_EXECUTE = 'shouldExecute'
}

async function run() {
  try {
    const skipOnCommitMsg = core.getInput(INPUT_PARAMS.SKIP_ON_COMMIT_MSG)
    const ghToken = core.getInput(INPUT_PARAMS.GH_TOKEN)

    core.debug(`reading git commit message to resolve the output variable, output variable will be true if commit message contains message "${skipOnCommitMsg}"`)

    const octokit = github.getOctokit(ghToken)
    octokit.rest

    const { eventName } = github.context
    core.info(`event name: ${eventName}`)
    let sha = ''
    switch (eventName) {
      case 'pull_request':
        core.info(JSON.stringify(github.context.payload.pull_request))
        sha = github.context.payload.pull_request?.head.sha ?? `unknown`
        break
      case 'push':
        sha = github.context.sha
        break
      default:
        core.setFailed(`no implementation for event name ${eventName}`)
        return
    }

    core.info(`sha: ${sha}`)
    if (sha) {
      const q = `hash:${sha}`
      console.info(`q: ${q}`)
      const { data } = await octokit.rest.search.commits({ q })
      core.info(`found ${data.total_count} commits for sha ${sha}`)

      if (data.total_count === 0) {
        core.setFailed(`could not find commit with sha ${sha}`)
        return
      }

      const commitMessage = data.items[0].commit.message as string
      core.info(`commit message to check against ${commitMessage}`)

      if (commitMessage.includes(skipOnCommitMsg)) {
        core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, false)
        return
      }
    }

    core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, true)
  } catch (error) {
    core.error('there was an error')
    if (error instanceof Error) {
      core.setFailed(error.message)
    }

    try {
      core.setFailed(JSON.stringify(error))
    } catch (err) {
      core.setFailed(`there was an error, can't print JSON.stringify failed`)
    }
  }
}

run()
