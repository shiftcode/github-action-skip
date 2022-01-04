import * as core from '@actions/core'
import * as github from '@actions/github'
import https from 'https'

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

    if (sha) {
      const url = `https://api.github.com/repos/${github.context.payload.repository?.full_name}/git/commits/${sha}`
      core.info(`fetch commit with url: ${url}`)
      const commit = (await fetch(url, ghToken)) as { message: string } /* and others */

      const commitMessage = commit.message
      core.info(`commit message to check against ${commitMessage}`)

      if (commitMessage.includes(skipOnCommitMsg)) {
        core.info(`commit message includes skip message (${skipOnCommitMsg}) -> set output ${OUTPUT_PARAMS.SHOULD_EXECUTE} = false`)
        core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, false)
        return
      }
    }

    core.info(`commit message does not include skip message (${skipOnCommitMsg}) -> set output ${OUTPUT_PARAMS.SHOULD_EXECUTE} = true`)
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

async function fetch(url, token) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'Github Skip Action',
      },
    }, res => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        resolve(JSON.parse(data))
      })
    })
  })
}

run()
