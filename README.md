# shiftcode/github-action-skip

Github Actions have [native support](https://github.blog/changelog/2021-02-08-github-actions-skip-pull-request-and-push-workflows-with-skip-ci/) to skip an entire workflow depending on commit message. But since we rely on status checks
for our Pull Requests to be green, we need another option.

This action accepts an input string `skipOnCommitMsg` which will be used to check if the commit message contains the given string.
If yes the output `shouldExecute` will be set to `false`. `true` otherwise. For full input / output list and other configurations check [`action.yml`](./action.yml).

## Example GitHub Workflow definition
This example shows how to setup two dependant jobs, the second will only be executed if the output from `checkExecution` job is `false`.

```yaml
# jobs
checkExecution:
    runs-on: ubuntu-latest
    outputs:
      shouldExecute: ${{ steps.stepCheckExecution.outputs.shouldExecute }}
    steps:
      - id: stepCheckExecution
        name: Check for execution
        uses: shiftcode/github-action-skip@releases/v2-alpha.0
        with:
          skipOnCommitMsg: "[skip_build]"
          githubToken: ${{secrets.GH_TOKEN_3}}
build:
    runs-on: ubuntu-latest
    needs: checkExecution
    # only execute if not skipped by commit message
    if: needs.checkExecution.outputs.shouldExecute == 'true'
    steps: ...
```

## Publish to a distribution branch

Actions will be consumed from GitHub repos. All the dependencies must be pushed there. This means for JS also 
`node_module` must be published.

Comment out `node_modules`  in [.gitignore](./.gitignore) and create a `releases/**` branch
```bash
# comment out in distribution branches
# node_modules/
```

Then run the following commands:

```bash
$ git checkout -b releases/v1
$ npm prune --production
$ git add node_modules
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and tested action

```yaml
uses: shiftcode/github-action-skip@v1
with:
  skipOnCommitMsg: "[skip build]"
  githubtoken: ${{secrets.GH_TOKEN}}
```