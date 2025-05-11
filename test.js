import dotenv from "dotenv";
import makeCommit, {
  getCommitMessage,
  getCommitPath,
  getCommitContent,
} from "./crackd.js";

dotenv.config();

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

makeCommit({
  commitMessage: getCommitMessage(),
  commitPath: getCommitPath(),
  commitContent: getCommitContent(),
  commitBranch: "main",
  commitRepo: process.env.REPO_NAME,
  commitOwner: process.env.GITHUB_USERNAME,
});
