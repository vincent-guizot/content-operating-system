export default function ArticleMeta({ article }) {
  return (
    <p className="text-sm opacity-60 mb-6">
      {article.author} • {article.createdAt}
    </p>
  );
}
