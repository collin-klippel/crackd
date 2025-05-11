import dotenv from "dotenv";
import makeCommit from "./crackd.js";

dotenv.config();

makeCommit({
  commitRepo: process.env.REPO_NAME,
  commitOwner: process.env.GITHUB_USERNAME,
  githubToken: process.env.GITHUB_TOKEN,
});
