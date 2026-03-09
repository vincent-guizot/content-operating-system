import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";

import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";
import PopUp from "../../components/shared/feedback/PopUp";

import UploadMedia from "./UploadMedia";

import useSearch from "../../hooks/useSearch";

import { getMedia, deleteMedia } from "../../services";

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);

  const [openUpload, setOpenUpload] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      await deleteMedia(id);
      fetchMedia();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

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
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={16} />
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>

        <button
          onClick={() => setOpenUpload(true)}
          className="os-btn-primary flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Media
        </button>
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

      {/* POPUP */}

      <PopUp
        open={openUpload}
        title="Upload Media"
        onClose={() => setOpenUpload(false)}
      >
        <UploadMedia
          onSuccess={() => {
            fetchMedia();
            setOpenUpload(false);
          }}
        />
      </PopUp>
    </div>
  );
}
