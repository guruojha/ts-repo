# Repository Setup

This documents how the Codespace project was saved to GitHub, including the permission problem encountered during setup.

## Local repository

The workspace started as an empty folder rather than a cloned GitHub repository. We initialized Git locally:

```bash
git init
git status
```

The project was then staged and committed:

```bash
git add .
git commit -m "Create TypeScript Codespaces demo"
```

The local commit created for the demo was:

```text
d3454f9 Create TypeScript Codespaces demo
```

## First push attempt

The intended command was:

```bash
gh repo create ts-repo --private --source=. --remote=origin --push
```

GitHub CLI was authenticated as `guruojha`, but the Codespaces token did not have permission to create repositories. GitHub returned:

```text
guruojha does not have the correct permissions to execute CreateRepository
```

This did not remove the local commit. The project remained safe in the Codespace.

## Recovery

When the CLI cannot create a repository, create it from the GitHub website instead:

1. Open [github.com/new](https://github.com/new).
2. Set the repository name to `ts-repo`.
3. Choose **Private** unless the project should be public.
4. Do not add another README, `.gitignore`, or license because this workspace already contains them.
5. Select **Create repository**.

After the empty repository exists, connect and push the local branch:

```bash
git remote add origin https://github.com/guruojha/ts-repo.git
git push -u origin main
```

Check the result with:

```bash
git remote -v
git status
git log --oneline -1
```

## Reopening the Codespace

Once the repository is pushed, open `guruojha/ts-repo` on GitHub, choose **Code**, open the **Codespaces** tab, and create a Codespace from the `main` branch. The files and Git history will then be available in the new Codespace.

## Important distinction

Saving files in a Codespace and pushing them to GitHub are separate actions:

- The Codespace stores the current working files temporarily.
- A Git commit stores a snapshot in local history.
- A push sends committed history to the GitHub repository.

For a durable copy, commit and push the work before deleting or allowing the Codespace to expire.