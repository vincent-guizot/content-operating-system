export default function ArticleTags({ tags }) {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((item) => (
        <span
          key={item.tagId}
          className="px-3 py-1 text-xs bg-gray-200 rounded"
        >
          #{item.tag.name}
        </span>
      ))}
    </div>
  );
}
