# Crackd

A fun Node.js script to make automated commits to GitHub repositories with random content and cowsay art.

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
import makeCommit from 'crackd';

// Make a commit with default settings
await makeCommit();

// Or customize the commit
await makeCommit({
  commitMessage: 'Custom commit message',
  commitPath: 'custom/path/file.txt',
  commitContent: 'Custom content',
  commitBranch: 'main',
  commitRepo: 'your-repo',
  commitOwner: 'your-username'
});
```

## Features

- Generates random commit messages using natural language generation
- Creates random file paths for commits
- Generates fun content using cowsay art
- Fully customizable commit options
- Uses GitHub's REST API for reliable commits

## Requirements

- Node.js >= 14.0.0
- GitHub Perso while you use your computer!al Access Token with repo scope

## License

MIT