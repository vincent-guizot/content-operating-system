import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import { articles } from "../../data/articles";

import ArticleCard from "../../components/shared/ui/ArticleCard";
import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";

import useSearch from "../../hooks/useSearch";

export default function Articles() {
  const [view, setView] = useState("grid");

  const { query, setQuery, filteredData } = useSearch(articles, [
    "title",
    "brand",
    "category",
  ]);

  const columns = [
    { key: "title", label: "Title" },
    { key: "brand", label: "Brand" },
    { key: "status", label: "Status" },
    { key: "author", label: "Author" },
    { key: "createdAt", label: "Date" },
    { key: "views", label: "Views" },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/articles/${row.id}/edit`}>
            <Pencil size={14} />
          </Link>

          <button className="text-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
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

      {/* GRID VIEW */}

      {view === "grid" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filteredData.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* TABLE VIEW */}

      {view === "table" && <DataTable columns={columns} data={filteredData} />}
    </div>
  );
}
