export interface PRAuthor {
  login: string;
  avatarUrl: string | null;
}

export interface PRReviewer {
  login: string;
  avatarUrl: string | null;
  state?: string;
}

export interface PullRequest {
  org: string;
  repo: string;
  number: number;
  title: string;
  body: string;
  author: PRAuthor;
  headSha: string;
  baseBranch: string;
  headBranch: string;
  state: 'open' | 'closed' | 'merged';
  reviewers: PRReviewer[];
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PRFile {
  path: string;
  status: 'added' | 'removed' | 'modified' | 'renamed';
  additions: number;
  deletions: number;
  patch?: string;
}
