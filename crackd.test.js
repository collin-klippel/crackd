import { jest } from '@jest/globals';

// Prepare a variable to hold the mock Octokit instance
let mockOctokitInstance;

jest.unstable_mockModule("@octokit/rest", () => ({
  Octokit: function() { return mockOctokitInstance; }
}));

const sentenceMock = jest.fn();
const paragraphMock = jest.fn();
jest.unstable_mockModule("@ndaidong/txtgen", () => ({
  sentence: sentenceMock,
  paragraph: paragraphMock
}));

const cowsaySayMock = jest.fn();
jest.unstable_mockModule("cowsay", () => ({
  say: cowsaySayMock
}));

describe("crackd", () => {
  let makeCommit;

  beforeAll(async () => {
    // Dynamically import after all mocks are set up
    ({ default: makeCommit } = await import("./crackd.js"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("makeCommit", () => {
    const mockOptions = {
      githubToken: "fake-token",
      commitOwner: "test-owner",
      commitRepo: "test-repo",
    };

    beforeEach(() => {
      mockOctokitInstance = {
        repos: {
          get: jest.fn(),
        },
        git: {
          getRef: jest.fn(),
          createBlob: jest.fn(),
          createTree: jest.fn(),
          createCommit: jest.fn(),
          updateRef: jest.fn(),
        },
      };
      sentenceMock.mockReturnValue("Test commit message");
      paragraphMock.mockReturnValue("Test content");
      cowsaySayMock.mockReturnValue("🐮 Test content 🐮");
    });

    it("should throw error if githubToken is not provided", async () => {
      const options = { ...mockOptions, githubToken: undefined };
      await expect(makeCommit(options)).rejects.toThrow("GitHub token is required");
    });

    it("should throw error if commitOwner is not provided", async () => {
      const options = { ...mockOptions, commitOwner: undefined };
      await expect(makeCommit(options)).rejects.toThrow("Commit owner and repo are required");
    });

    it("should throw error if commitRepo is not provided", async () => {
      const options = { ...mockOptions, commitRepo: undefined };
      await expect(makeCommit(options)).rejects.toThrow("Commit owner and repo are required");
    });

    it("should successfully create a commit with default values", async () => {
      // Mock the GitHub API responses
      mockOctokitInstance.repos.get.mockResolvedValue({
        data: { default_branch: "main" },
      });

      mockOctokitInstance.git.getRef.mockResolvedValue({
        data: { object: { sha: "latest-commit-sha" } },
      });

      mockOctokitInstance.git.createBlob.mockResolvedValue({
        data: { sha: "blob-sha" },
      });

      mockOctokitInstance.git.createTree.mockResolvedValue({
        data: { sha: "tree-sha" },
      });

      mockOctokitInstance.git.createCommit.mockResolvedValue({
        data: { sha: "new-commit-sha" },
      });

      mockOctokitInstance.git.updateRef.mockResolvedValue({});

      // Spy on console.log
      const consoleSpy = jest.spyOn(console, "log");

      await makeCommit(mockOptions);

      // Verify the GitHub API calls
      expect(mockOctokitInstance.repos.get).toHaveBeenCalledWith({
        owner: "test-owner",
        repo: "test-repo",
      });

      expect(mockOctokitInstance.git.getRef).toHaveBeenCalledWith({
        owner: "test-owner",
        repo: "test-repo",
        ref: "heads/main",
      });

      expect(mockOctokitInstance.git.createBlob).toHaveBeenCalledWith({
        owner: "test-owner",
        repo: "test-repo",
        content: "🐮 Test content 🐮",
        encoding: "utf-8",
      });

      expect(mockOctokitInstance.git.createTree).toHaveBeenCalledWith({
        owner: "test-owner",
        repo: "test-repo",
        base_tree: "latest-commit-sha",
        tree: expect.arrayContaining([
          expect.objectContaining({
            path: expect.any(String),
            mode: "100644",
            type: "blob",
            sha: "blob-sha",
          }),
        ]),
      });

      expect(mockOctokitInstance.git.createCommit).toHaveBeenCalledWith({
        owner: "test-owner",
        repo: "test-repo",
        message: "Test commit message",
        tree: "tree-sha",
        parents: ["latest-commit-sha"],
      });

      expect(mockOctokitInstance.git.updateRef).toHaveBeenCalledWith({
        owner: "test-owner",
        repo: "test-repo",
        ref: "heads/main",
        sha: "new-commit-sha",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Successfully created commit:",
        "Test commit message"
      );
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("API Error");
      mockOctokitInstance.repos.get.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, "error");

      await makeCommit(mockOptions);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error making commit:",
        "API Error"
      );
    });
  });
}); 