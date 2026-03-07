import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";

import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";

import PopUp from "../../components/shared/feedback/PopUp";
import ConfirmDialog from "../../components/shared/feedback/ConfirmDialog";
import Toast from "../../components/shared/feedback/Toast";
import EmptyState from "../../components/shared/feedback/EmptyState";

import CreateCategoryForm from "./CreateCategory";

import useSearch from "../../hooks/useSearch";

import { getCategories, getBrands, deleteCategory } from "../../services";

export default function Categories() {
  const [categories, setCategories] = useState([]);
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
        const catData = await getCategories();
        const brandData = await getBrands();

        setCategories(catData);
        setBrands(brandData);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { query, setQuery, filteredData } = useSearch(categories, ["name"]);

  // GROUP CATEGORY BY BRAND
  const groupedCategories = brands.map((brand) => ({
    ...brand,
    categories: filteredData.filter((c) => c.brandId === brand.id),
  }));

  // DELETE
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCategory(deleteTarget.id);

      const updated = categories.filter((c) => c.id !== deleteTarget.id);

      setCategories(updated);

      setToast({
        show: true,
        type: "success",
        message: "Category deleted",
      });

      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Category Name" },

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
    return <div className="text-sm opacity-70">Loading categories...</div>;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>

        <button onClick={() => setOpenCreate(true)} className="os-btn-primary">
          + Create Category
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
        <EmptyState
          title="No Categories"
          description="Create your first category."
        />
      )}

      {/* CATEGORY BOARD */}
      {view === "grid" && filteredData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groupedCategories.map((brand) => (
            <div key={brand.id} className="os-card bg-[#f4e8c7]/40">
              <h2 className="font-semibold mb-3">{brand.name}</h2>

              <div className="flex flex-wrap gap-2">
                {brand.categories.map((cat) => (
                  <span
                    key={cat.id}
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
                    {cat.name}

                    <button
                      onClick={() => setDeleteTarget(cat)}
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

      {/* CREATE CATEGORY POPUP */}
      <PopUp
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create Category"
      >
        <CreateCategoryForm
          onSuccess={() => {
            setOpenCreate(false);

            setToast({
              show: true,
              type: "success",
              message: "Category created",
            });
          }}
        />
      </PopUp>

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Category"
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
