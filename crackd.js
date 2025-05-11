import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import { sentence, paragraph } from "@ndaidong/txtgen";
import cowsay from "cowsay";

dotenv.config();

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

function getCommitMessage() {
  return sentence();
}

function getCommitPath() {
  return `blog/${sentence()
    .split(" ")
    .join("-")
    .replaceAll(".", "")
    .replaceAll(",", "")
    .replaceAll("!", "")
    .replaceAll("?", "")
    .toLocaleLowerCase()}.txt`;
}

function getCommitContent() {
  return cowsay.say({
    text: paragraph(),
    e: "oO",
    T: "U ",
  });
}

export default async function makeCommit(options = {}) {
  const {
    commitMessage = getCommitMessage(),
    commitPath = getCommitPath(),
    commitContent = getCommitContent(),
    commitBranch = "main",
    commitRepo = process.env.REPO_NAME,
    commitOwner = process.env.GITHUB_USERNAME,
  } = options;

  if (
    !commitMessage ||
    !commitPath ||
    !commitContent ||
    !commitRepo ||
    !commitOwner
  ) {
    throw new Error("All options are required");
  }

  try {
    // Get the default branch (usually 'main' or 'master')
    const { data: repo } = await octokit.repos.get({
      owner: commitOwner,
      repo: commitRepo,
    });

    const defaultBranch = repo.default_branch;

    // Get the latest commit SHA
    const { data: ref } = await octokit.git.getRef({
      owner: commitOwner,
      repo: commitRepo,
      ref: `heads/${defaultBranch}`,
    });

    const latestCommitSha = ref.object.sha;

    // Create a new blob with the content
    const { data: blob } = await octokit.git.createBlob({
      owner: commitOwner,
      repo: commitRepo,
      content: commitContent,
      encoding: "utf-8",
    });

    // Create a new tree
    const { data: tree } = await octokit.git.createTree({
      owner: commitOwner,
      repo: commitRepo,
      base_tree: latestCommitSha,
      tree: [
        {
          path: commitPath,
          mode: "100644",
          type: "blob",
          sha: blob.sha,
        },
      ],
    });

    // Create the commit
    const { data: commit } = await octokit.git.createCommit({
      owner: commitOwner,
      repo: commitRepo,
      message: commitMessage,
      tree: tree.sha,
      parents: [latestCommitSha],
    });

    // Update the reference
    await octokit.git.updateRef({
      owner: commitOwner,
      repo: commitRepo,
      ref: `heads/${commitBranch}`,
      sha: commit.sha,
    });

    console.log("Successfully created commit:", commitMessage);
  } catch (error) {
    console.error("Error making commit:", error.message);
  }
}

// Run the script
makeCommit();

export { getCommitMessage, getCommitPath, getCommitContent };
