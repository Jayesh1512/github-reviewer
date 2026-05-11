/** Narrow shapes we use from GitHub REST; extend as needed. */
export type GitHubPullListItem = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  user: { login: string; avatar_url: string };
  head: { ref: string; sha: string };
  base: { ref: string };
  state: string;
  created_at: string;
  updated_at: string;
};
