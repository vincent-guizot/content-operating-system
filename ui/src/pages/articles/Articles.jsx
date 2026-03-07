import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import ArticleCard from "../../components/shared/ui/ArticleCard";
import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";

import Alert from "../../components/shared/feedback/Alert";
import Toast from "../../components/shared/feedback/Toast";
import EmptyState from "../../components/shared/feedback/EmptyState";
import ConfirmDialog from "../../components/shared/feedback/ConfirmDialog";

import useSearch from "../../hooks/useSearch";

import { getArticles, deleteArticle } from "../../services/article.service";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  // FETCH ARTICLES
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const { query, setQuery, filteredData } = useSearch(articles, [
    "title",
    "brand",
    "category",
  ]);

  // DELETE HANDLER
  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    } else {
      try {
        await deleteArticle(deleteTarget.id);
        const updated = articles.filter((a) => a.id !== deleteTarget.id);
        setArticles(updated);
        setToast({
          show: true,
          type: "success",
          message: "Article deleted",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to delete article");
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <Link
          to={`/articles/${row.slug}`}
          className="hover:text-blue-600 font-medium"
        >
          {row.title}
        </Link>
      ),
    },

    { key: "brand", label: "Brand" },
    { key: "status", label: "Status" },
    { key: "author", label: "Author" },
    { key: "createdAt", label: "Date" },
    { key: "views", label: "Views" },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-3 items-center">
          <Link
            to={`/articles/${row.id}/edit`}
            className="text-gray-700 hover:text-blue-600"
          >
            <Pencil size={16} />
          </Link>

          <button
            onClick={() => setDeleteTarget(row)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="text-sm opacity-70">Loading articles...</div>;
  }

  return (
    <div>
      {/* ERROR ALERT */}

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      {/* HEADER */}

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>

        <Link to="/articles/create" className="os-btn-primary">
          + Create Scroll
        </Link>
      </div>

      {/* TOOLBAR */}

      <DataToolbar
        view={view}
        setView={setView}
        search={query}
        setSearch={setQuery}
      />

      {/* EMPTY STATE */}

      {filteredData.length === 0 && (
        <EmptyState
          title="No Articles"
          description="Create your first scroll."
        />
      )}

      {/* GRID VIEW */}

      {view === "grid" && filteredData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filteredData.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              setDeleteTarget={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* TABLE VIEW */}

      {view === "table" && filteredData.length > 0 && (
        <DataTable columns={columns} data={filteredData} />
      )}

      {/* CONFIRM DELETE */}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Article"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* TOAST */}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
