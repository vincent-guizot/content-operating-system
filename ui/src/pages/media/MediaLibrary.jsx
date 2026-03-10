import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";

import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";
import PopUp from "../../components/shared/feedback/PopUp";

import UploadMedia from "./UploadMedia";

import useSearch from "../../hooks/useSearch";

import { getMedia, deleteMedia } from "../../services";
import ConfirmDialog from "../../components/shared/feedback/ConfirmDialog";
import Toast from "../../components/shared/feedback/Toast";

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);

  const [openUpload, setOpenUpload] = useState(false);
  const [preview, setPreview] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });
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

  const confirmDelete = (item) => {
    setDeleteTarget(item);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMedia(deleteTarget.id);

      setToast({
        show: true,
        type: "success",
        message: "Media deleted successfully",
      });

      fetchMedia();
    } catch (err) {
      setToast({
        show: true,
        type: "error",
        message: "Failed to delete media",
      });
    }

    setDeleteTarget(null);
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
          className="w-16 h-12 object-cover rounded border cursor-pointer"
          onClick={() => setPreview(row)}
        />
      ),
    },
    {
      key: "name",
      label: "File Name",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-600 hover:text-red-800"
        >
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

      {/* TABLE VIEW */}
      {view === "table" && <DataTable columns={columns} data={filteredData} />}

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="relative border rounded overflow-hidden bg-white group"
            >
              {/* DELETE ICON */}
              <button
                onClick={() => confirmDelete(item)}
                className="absolute top-2 right-2 bg-white/90 p-1 rounded shadow"
              >
                <Trash2 size={14} className="text-red-600" />
              </button>

              {/* IMAGE */}
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-32 object-cover cursor-pointer"
                onClick={() => setPreview(item)}
              />

              {/* FILE NAME */}
              <div className="text-xs p-2 truncate">{item.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD POPUP */}
      <PopUp
        isOpen={openUpload}
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

      {/* IMAGE PREVIEW POPUP */}
      <PopUp
        isOpen={!!preview}
        title={preview?.name}
        width="max-w-3xl"
        onClose={() => setPreview(null)}
      >
        {preview && (
          <img
            src={preview.url}
            alt={preview.name}
            className="w-full rounded"
          />
        )}
      </PopUp>
      {/* DELETE CONFIRM */}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Media"
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
