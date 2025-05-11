# Crackd 💊

This Node.js script allows you to make commits to a GitHub repository programmatically.

## Setup

1. Install:

```bash
npm install crackd
```

2. Create a `.env` file in the root directory with the following variables:

```
GITHUB_TOKEN=your_github_token_here
GITHUB_USERNAME=your_username_here
REPO_NAME=your_repo_name_here
```

To get a GitHub token:

1. Go to GitHub Settings > Developer Settings > Personal Access Tokens
2. Generate a new token with the `repo` scope
3. Copy the token and paste it in your `.env` file

## Usage

Currently the only export is the `makeCommit` function.

Import the module:

```bash
import makeCommit from "crackd"
```

Make a call to create the commit:

```js
makeCommit({
  commitMessage: getCommitMessage(),
  commitPath: getCommitPath(),
  commitContent: getCommitContent(),
  commitBranch: "main",
  commitRepo: process.env.REPO_NAME,
  commitOwner: process.env.GITHUB_USERNAME,
});
```

In the future we'll provide reccuring commit functionality that runs in the background to keep your GitHub profile green!