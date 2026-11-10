export function Tags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
          {tag}
        </li>
      ))}
    </ul>
  );
}
