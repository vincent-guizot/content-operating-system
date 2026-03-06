import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";

import useSearch from "../../hooks/useSearch";

import { getMedia } from "../../services";

export default function Media() {
  const [media, setMedia] = useState([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await getMedia();
        setMedia(data);
      } catch (err) {
        console.error("Failed to fetch media:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const { query, setQuery, filteredData } = useSearch(media, ["name"]);

  const columns = [
    {
      key: "preview",
      label: "Preview",
      render: (row) => (
        <img
          src={row.url}
          alt={row.name}
          className="w-16 h-12 object-cover rounded border"
        />
      ),
    },

    { key: "name", label: "File Name" },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button className="text-red-600">
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="text-sm opacity-70">Loading media...</div>;
  }

  return (
    <div>
      {/* HEADER */}

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>

        <Link to="/media/create" className="os-btn-primary">
          + Upload Media
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
