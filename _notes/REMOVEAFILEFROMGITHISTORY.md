  # Remove a file from Git history (local and remote)

- First we need to install pip3 install git-filter-repo
  - `python3 -m git_filter_repo --path XXX(filePath) --invert-paths --force`
  - `(this will remove the origin from local which you then need to add again with: git remote add origin <your-repository-url>)`
  - `git push origin --force --all`