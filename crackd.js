import { Octokit } from "@octokit/rest";
import { sentence, paragraph } from "@ndaidong/txtgen";
import cowsay from "cowsay";

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
    commitBranch = "main",
    commitContent = getCommitContent(),
    commitMessage = getCommitMessage(),
    commitOwner,
    commitPath = getCommitPath(),
    commitRepo,
    githubToken,
  } = options;

  if (!githubToken) {
    throw new Error("GitHub token is required");
  }

  if (!commitOwner || !commitRepo) {
    throw new Error("Commit owner and repo are required");
  }

  try {
    // Initialize Octokit with GitHub token
    const octokit = new Octokit({
      auth: githubToken,
    });

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
