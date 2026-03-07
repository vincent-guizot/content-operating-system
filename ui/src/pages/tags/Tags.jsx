import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";

import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";

import ConfirmDialog from "../../components/shared/feedback/ConfirmDialog";
import Toast from "../../components/shared/feedback/Toast";
import EmptyState from "../../components/shared/feedback/EmptyState";
import PopUp from "../../components/shared/feedback/PopUp";

import CreateTagForm from "./CreateTag";

import useSearch from "../../hooks/useSearch";

import { getTags, getBrands, deleteTag } from "../../services";

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [brands, setBrands] = useState([]);

  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsData = await getTags();
        const brandsData = await getBrands();

        setTags(tagsData);
        setBrands(brandsData);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { query, setQuery, filteredData } = useSearch(tags, ["name"]);

  // GROUP TAGS BY BRAND
  const groupedTags = brands.map((brand) => ({
    ...brand,
    tags: filteredData.filter((tag) => tag.brandId === brand.id),
  }));

  // DELETE TAG
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteTag(deleteTarget.id);

      const updated = tags.filter((t) => t.id !== deleteTarget.id);

      setTags(updated);

      setToast({
        show: true,
        type: "success",
        message: "Tag deleted",
      });

      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete tag:", err);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tag Name" },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button onClick={() => setDeleteTarget(row)} className="text-red-600">
          <Trash2 size={16} />
        </button>
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

        <button onClick={() => setOpenCreate(true)} className="os-btn-primary">
          + Create Tag
        </button>
      </div>

      {/* TOOLBAR */}

      <DataToolbar
        view={view}
        setView={setView}
        search={query}
        setSearch={setQuery}
      />

      {/* EMPTY */}

      {filteredData.length === 0 && (
        <EmptyState title="No Tags" description="Create your first tag." />
      )}

      {/* TAG BOARD VIEW */}

      {view === "grid" && filteredData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groupedTags.map((brand) => (
            <div key={brand.id} className="os-card bg-[#f4e8c7]/40">
              <h2 className="font-semibold mb-3">{brand.name}</h2>

              <div className="flex flex-wrap gap-2">
                {brand.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="
                    flex items-center gap-1
                    text-xs
                    px-3 py-1
                    rounded
                    bg-[#f4e8c7]/80
                    hover:bg-[#f4e8c7]
                    transition
                    cursor-pointer
                    "
                  >
                    {tag.name}

                    <button
                      onClick={() => setDeleteTarget(tag)}
                      className="text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}

      {view === "table" && filteredData.length > 0 && (
        <DataTable columns={columns} data={filteredData} />
      )}

      {/* CREATE TAG POPUP */}

      <PopUp
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create Tag"
      >
        <CreateTagForm
          onSuccess={() => {
            setOpenCreate(false);

            setToast({
              show: true,
              type: "success",
              message: "Tag created",
            });
          }}
        />
      </PopUp>

      {/* CONFIRM DELETE */}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Tag"
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
