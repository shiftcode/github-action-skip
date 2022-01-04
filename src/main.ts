import * as core from '@actions/core'
import * as github from '@actions/github'
import { execSync } from 'child_process'

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
      const commitMessage = execSync(`git log --format=%B -n 1 ${sha}`, { encoding: 'utf8' }).trim()
      // const q = `hash:${sha}`
      // console.info(`q: ${q}`)
      // const response = await fetch(`https://api.github.com/repos/shiftcode/sc-commons/git/commits/${sha}`, { headers: new Headers({ Authorization: `token ${ghToken}` }) })
      // if (response.status >= 200 && response.status < 300) {
      //   // ok
      //   const commit = await response.json() as { message: string }
      //   const commitMessage = commit.message as string
        core.info(`commit message to check against ${commitMessage}`)

        if (commitMessage.includes(skipOnCommitMsg)) {
          core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, false)
          return
        }
      // } else {
      //   core.setFailed(`could not find commit for sha ${sha} -> got status code ${response.status}: ${response.statusText}`)
      // }
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
