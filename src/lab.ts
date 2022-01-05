import { Octokit } from '@octokit/rest'
import * as https from 'https'

const token = process.env.GH_TOKEN
const sha = process.env.GH_SHA
console.log(`try resolving commit for sha ${sha} using gh token ${token}`)

runWithOctokit().then(() => runOther())

async function runWithOctokit() {
  console.log(`### execution with octokit client`)
  const o = new Octokit({ auth: token })

  const { data } = await o.request('/user')
  console.log(`current user: ${data.login}`)

  // query try out
  /*
  const q = `repo:shiftcode/sc-commons next`
  const q = `hash:${sha} repo:shiftcode/sc-commons rev:@*refs/heads/* type:diff`
  const q = `repo:shiftcode/sc-commons@${sha} type:diff`
  const q = `hash:${sha} rev:@*refs/heads/*`
  */
  const q = `hash:${sha} repo:shiftcode/sc-commons rev:@refs/heads/#102-fix-peer-deps-version`
  console.info(`execute with search query: ${q}`)
  const response = await o.rest.search.commits({ q })
  // seems like octokit will only return commits from default branch
  console.log(`found ${response.data.total_count} commits for sha ${sha}`)
  for (const { commit } of response.data.items) {
    console.log(`----------------- ${commit.url} -----------------`)
    console.log(commit.message)
    console.log('-------------------------------------------------')
  }
}

async function runOther() {
  console.log(`### execution with plain http request`)
  const url = `https://api.github.com/repos/shiftcode/sc-commons/git/commits/${sha}`
  console.log(url)
  const commit = (await fetch(url)) as {
    sha: string
    url: string
    message: string
  } /* and others */
  console.log(`----------------- ${commit.url} -----------------`)
  console.log(commit.message)
  console.log('-------------------------------------------------')
}

async function fetch(url) {
  return new Promise((resolve) => {
    https.get(
      url,
      {
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'Github Skip Action',
        },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          resolve(JSON.parse(data))
        })
      },
    )
  })
}
