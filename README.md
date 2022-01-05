# shiftcode/github-action-skip

![version](https://img.shields.io/github/last-commit/shiftcode/github-action-skip)
![version](https://img.shields.io/github/tag/shiftcode/github-action-skip?label=version)

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

## Development
### new version
1) implement your changes
2) commit changes (pre-commit hook will do some code checks / changes and build the artifacts using ncc)
3) set tag `git tag -a -m "my fancy release" v0.0.X`
4) push with tags `git push --follow-tags`