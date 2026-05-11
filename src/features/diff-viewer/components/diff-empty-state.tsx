export function DiffEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
      <p className="text-sm font-medium text-foreground">Select a file</p>
      <p className="max-w-sm text-xs">Choose a changed file from the sidebar to view its diff.</p>
    </div>
  );
}
