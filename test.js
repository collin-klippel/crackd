import dotenv from "dotenv";
import makeCommit from "./crackd.js";

dotenv.config();

makeCommit({
  commitBranch: "main",
  commitRepo: process.env.REPO_NAME,
  commitOwner: process.env.GITHUB_USERNAME,
});
