import {Octokit} from '@octokit/rest'
import fetch, {Headers} from 'node-fetch'
run()

async function run(){
  const o = new Octokit({auth: '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'})

  // const { data } = await o.request("/user");
  // console.log(data)
  const sha = 'fd3d6b191cf773f68ca6dfc57bc52e28513fd8d1'
  // const q = `repo:shiftcode/sc-commons next`
  // const q = `hash:${sha} repo:shiftcode/sc-commons rev:@*refs/heads/* type:diff`
  // const q = `repo:shiftcode/sc-commons@${sha} type:diff`
  // const q = `hash:${sha} rev:@*refs/heads/*`
  const q = `hash:${sha} repo:shiftcode/sc-commons rev:@refs/heads/#102-fix-peer-deps-version type:diff`
console.info(`q: ${q}`,)
const response = await o.rest.search.commits({q})
  console.log(response)
  for(const {commit} of response.data.items){
    console.log(`----------------- ${commit.url} -----------------`)
    console.log(commit.message)
    console.log('-------------------------------------------------')
  }

  const headers = new Headers()
      headers.set('Authorization', 'token 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')

  const response2 = await fetch(`https://api.github.com/repos/shiftcode/sc-commons/git/commits/${sha}`, {
    headers
  } as any)
  console.log(response2.status)
  console.log(await response2.json())
}
