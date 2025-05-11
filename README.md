# Crackd

A fun Node.js script to make automated commits to GitHub repositories with random content and cowsay art.

## Requirements

- Node.js >= 14.0.0
- GitHub Personal Access Token with repo scope

## Installation

```bash
npm install crackd
```

## Usage

First, create a `.env` file in your project root with your GitHub credentials:

```env
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_github_username
REPO_NAME=your_repo_name
```

Then you can use the package in your code:

```javascript
import makeCommit from "crackd";

// Make a commit with default settings
await makeCommit({
  commitOwner: process.env.GITHUB_USERNAME,
  commitRepo: process.env.REPO_NAME,
  githubToken: process.env.GITHUB_TOKEN,
});

// Or customize the commit
await makeCommit({
  commitBranch: "main",
  commitContent: getCommitContent(),
  commitMessage: getCommitMessage(),
  commitOwner: process.env.GITHUB_USERNAME,
  commitPath: getCommitPath(),
  commitRepo: process.env.REPO_NAME,
  githubToken: process.env.GITHUB_TOKEN,
});
```

## Features

- Generates random commit messages using natural language generation
- Creates random file paths for commits
- Generates fun content using cowsay art
- Fully customizable commit options
- Uses GitHub's REST API for reliable commits

## License

MIT
