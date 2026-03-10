import { Link } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";

export default function ArticleHeader({ article, onDelete }) {
  return (
    <div className="flex justify-between items-start mb-6">
      <h1 className="text-4xl font-bold">{article.title}</h1>

      <div className="flex gap-3">
        <Link
          to={`/articles/edit/${article.slug}`}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Link>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          <Trash className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
