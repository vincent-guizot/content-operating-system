import { Link } from "react-router-dom";
import { Pencil, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function ArticleCard({ article }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="
      border border-[#B08968]
      bg-[#FDF6E3]
      rounded
      overflow-hidden
      shadow-sm
      flex flex-col
      "
    >
      <img
        src={article.thumbnail}
        alt={article.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-4 flex flex-col flex-1">
        <h2 className="font-semibold text-lg mb-1">{article.title}</h2>

        <p className="text-xs opacity-70 mb-2">
          {article.brand} • {article.category}
        </p>

        <span
          className={`text-[11px] px-2 py-[2px] rounded w-fit mb-2 ${
            article.status === "Published"
              ? "bg-green-200 text-green-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {article.status}
        </span>

        <p className="text-sm opacity-80 mb-3 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs opacity-70 mt-auto">
          <div>
            <div>{article.author}</div>
            <div>{article.createdAt}</div>
          </div>

          <div className="flex items-center gap-1">
            <Eye size={14} />
            {article.views}
          </div>
        </div>

        <div className="flex justify-end gap-3 text-xs mt-3">
          <Link
            to={`/articles/${article.slug}`}
            className="flex items-center gap-1 text-blue-600 opacity-70 hover:opacity-100"
          >
            <Eye size={14} />
            View
          </Link>
          <Link
            to={`/articles/${article.id}/edit`}
            className="flex items-center gap-1 opacity-70 hover:opacity-100"
          >
            <Pencil size={14} />
            Edit
          </Link>
          <button className="flex items-center gap-1 text-red-600 opacity-70 hover:opacity-100">
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
