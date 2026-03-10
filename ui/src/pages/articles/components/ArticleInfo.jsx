export default function ArticleInfo({ article }) {
  return (
    <div className="border-t mt-10 pt-6 text-sm space-y-2">
      <p>
        <b>Brand:</b> {article.brand?.name}
      </p>

      <p>
        <b>Category:</b> {article.category?.name}
      </p>

      <p>
        <b>Status:</b> {article.status}
      </p>

      <p>
        <b>Visibility:</b> {article.visibility}
      </p>

      <p>
        <b>Views:</b> {article.views}
      </p>

      <p>
        <b>Reading Time:</b> {article.readingTime} min
      </p>
    </div>
  );
}
