import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";

import useSearch from "../../hooks/useSearch";

import { getCategories } from "../../services/";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);

  // FETCH CATEGORIES

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const { query, setQuery, filteredData } = useSearch(categories, ["name"]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Category Name" },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/categories/${row.id}/edit`}>
            <Pencil size={14} />
          </Link>

          <button className="text-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="text-sm opacity-70">Loading categories...</div>;
  }

  return (
    <div>
      {/* HEADER */}

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>

        <Link to="/categories/create" className="os-btn-primary">
          + Create Category
        </Link>
      </div>

      {/* TOOLBAR */}

      <DataToolbar
        view={view}
        setView={setView}
        search={query}
        setSearch={setQuery}
      />

      {/* TABLE */}

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
