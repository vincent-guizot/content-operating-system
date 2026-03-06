import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";

import useSearch from "../../hooks/useSearch";

import { getTags } from "../../services";

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags();
        setTags(data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const { query, setQuery, filteredData } = useSearch(tags, ["name"]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tag Name" },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/tags/${row.id}/edit`}>
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
    return <div className="text-sm opacity-70">Loading tags...</div>;
  }

  return (
    <div>
      {/* HEADER */}

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>

        <Link to="/tags/create" className="os-btn-primary">
          + Create Tag
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
