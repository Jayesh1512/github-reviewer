'use client';

export default function PullRequestError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 text-center">
      <p className="text-sm text-destructive">{error.message || 'Could not load this pull request.'}</p>
      <button
        type="button"
        className="rounded-md border border-input px-3 py-1.5 text-sm"
        onClick={() => reset()}
      >
        Retry
      </button>
    </div>
  );
}
