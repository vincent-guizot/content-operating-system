import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { getArticles, deleteArticle } from "../../services/article.service";
import { Pencil, Trash } from "lucide-react/dist/cjs/lucide-react";

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const data = await getArticles();
      const found = data.find((a) => a.slug === slug);
      setArticle(found);
    };

    fetchArticle();
  }, [slug]);

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this article?");

    if (!confirmDelete) return;

    await deleteArticle(article.id);

    navigate("/articles");
  };

  if (!article) {
    return <div className="p-10 text-center">Article not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-4xl font-bold">{article.title}</h1>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Link
            to={`/articles/edit/${article.slug}`}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Trash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* META */}
      <p className="text-sm opacity-60 mb-6">
        {article.author} • {article.createdAt}
      </p>

      {/* COVER */}
      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="rounded-lg mb-6 w-full h-auto object-cover"
        />
      )}

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {article.tags?.map((tag) => (
          <span key={tag} className="px-3 py-1 text-xs bg-gray-200 rounded">
            #{tag}
          </span>
        ))}
      </div>

      {/* CONTENT */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* INFO */}
      <div className="border-t mt-10 pt-6 text-sm space-y-2">
        <p>
          <b>Brand:</b> {article.brand}
        </p>
        <p>
          <b>Category:</b> {article.category}
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
    </div>
  );
}
