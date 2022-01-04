branchName="releases/v2-alpha.1"
echo branch name $branchName

# prior to execute this command make sure to comment the line#4 where node_modules are ignored in .gitignore file
git checkout -b $branchName
# only install dependencies required during executino (no devDeps)
npm prune --production
git add node_modules
git commit -a -m "add runtime (prod) dependencies"
#git push origin $branchName