import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, FileText, Tag, Layers, Image } from "lucide-react";

import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";

import PopUp from "../../components/shared/feedback/PopUp";
import ConfirmDialog from "../../components/shared/feedback/ConfirmDialog";
import Toast from "../../components/shared/feedback/Toast";
import EmptyState from "../../components/shared/feedback/EmptyState";

import CreateBrandForm from "./CreateBrand";

import useSearch from "../../hooks/useSearch";

import {
  getBrands,
  getArticles,
  getCategories,
  getTags,
  getMedia,
  deleteBrand,
} from "../../services";
import BrandCard from "../../components/shared/ui/BrandCard";

export default function Brands() {
  const [brands, setBrands] = useState([]);

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [media, setMedia] = useState([]);

  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandsData = await getBrands();
        const articlesData = await getArticles();
        const categoriesData = await getCategories();
        const tagsData = await getTags();
        const mediaData = await getMedia();

        setBrands(brandsData);
        setArticles(articlesData);
        setCategories(categoriesData);
        setTags(tagsData);
        setMedia(mediaData);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { query, setQuery, filteredData } = useSearch(brands, ["name"]);

  // DELETE BRAND
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteBrand(deleteTarget.id);

      const updated = brands.filter((b) => b.id !== deleteTarget.id);

      setBrands(updated);

      setToast({
        show: true,
        type: "success",
        message: "Brand deleted",
      });

      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const columns = [
    { key: "id", label: "ID" },

    { key: "name", label: "Brand Name" },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-3">
          <Link to={`/brands/${row.id}/edit`}>
            <Pencil size={16} />
          </Link>

          <button onClick={() => setDeleteTarget(row)} className="text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="text-sm opacity-70">Loading brands...</div>;
  }

  return (
    <div>
      {/* HEADER */}

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>

        <button onClick={() => setOpenCreate(true)} className="os-btn-primary">
          + Create Brand
        </button>
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
        <EmptyState title="No Brands" description="Create your first brand." />
      )}

      {/* CARD VIEW */}
      {view === "grid" && filteredData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((brand) => {
            const articleCount = articles.filter(
              (a) => a.brandId === brand.id,
            ).length;

            const categoryCount = categories.filter(
              (c) => c.brandId === brand.id,
            ).length;

            const tagCount = tags.filter((t) => t.brandId === brand.id).length;

            const mediaCount = media.filter(
              (m) => m.brandId === brand.id,
            ).length;

            return (
              <BrandCard
                key={brand.id}
                brand={brand}
                articleCount={articleCount}
                categoryCount={categoryCount}
                tagCount={tagCount}
                mediaCount={mediaCount}
                onDelete={(brand) => setDeleteTarget(brand)}
              />
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}

      {view === "table" && filteredData.length > 0 && (
        <DataTable columns={columns} data={filteredData} />
      )}

      {/* CREATE BRAND POPUP */}

      <PopUp
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create Brand"
      >
        <CreateBrandForm
          onSuccess={() => {
            setOpenCreate(false);

            setToast({
              show: true,
              type: "success",
              message: "Brand created",
            });
          }}
        />
      </PopUp>

      {/* CONFIRM DELETE */}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Brand"
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
