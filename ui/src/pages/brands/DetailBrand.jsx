import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import PopUp from "../../components/shared/feedback/PopUp";

import CreateCategoryForm from "../categories/CreateCategory";
import CreateTagForm from "../tags/CreateTag";
import UploadMediaForm from "../media/UploadMedia";
import Toast from "../../components/shared/feedback/Toast";

import {
  getBrands,
  getArticles,
  getCategories,
  getTags,
  getMedia,
} from "../../services";

export default function DetailBrand() {
  const { id } = useParams();

  const [brand, setBrand] = useState(null);

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [media, setMedia] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [openCategory, setOpenCategory] = useState(false);
  const [openTag, setOpenTag] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const brands = await getBrands();
      const articles = await getArticles();
      const categories = await getCategories();
      const tags = await getTags();
      const media = await getMedia();

      const brandData = brands.find((b) => b.id === id);

      setBrand(brandData);

      setArticles(articles.filter((a) => a.brandId === id));
      setCategories(categories.filter((c) => c.brandId === id));
      setTags(tags.filter((t) => t.brandId === id));
      setMedia(media.filter((m) => m.brandId === id));
    };

    fetchData();
  }, [id]);

  if (!brand) {
    return <div>Loading brand...</div>;
  }

  const createCategorySuccess = () => {
    setOpenCategory(false);
    setToast({
      show: true,
      type: "success",
      message: "Category created",
    });
  };

  const createTagSuccess = () => {
    setOpenTag(false);
    setToast({
      show: true,
      type: "success",
      message: "Tag created",
    });
  };

  const uploadMediaSuccess = () => {
    setOpenMedia(false);
    setToast({
      show: true,
      type: "success",
      message: "Media uploaded",
    });
  };

  const published = articles.filter((a) => a.status === "Published");
  const drafts = articles.filter((a) => a.status === "Draft");

  return (
    <div className="space-y-10">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* BRAND LOGO */}

          <img
            src={`/brandlogo/${brand.slug}.png`}
            alt={brand.name}
            className="w-12 h-12 object-contain"
          />

          <div>
            <h1 className="text-3xl font-bold">{brand.name}</h1>
            <p className="text-sm opacity-70">Brand dashboard overview</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex gap-3">
          <Link to="/articles/create" className="os-btn-primary">
            + Create Article
          </Link>

          <button
            onClick={() => setOpenCategory(true)}
            className="os-btn-outline"
          >
            + Create Category
          </button>

          <button onClick={() => setOpenTag(true)} className="os-btn-outline">
            + Create Tag
          </button>

          <button onClick={() => setOpenMedia(true)} className="os-btn-outline">
            + Upload Media
          </button>
        </div>
      </div>

      {/* ARTICLES */}

      <div className="os-card">
        <h2 className="font-semibold text-lg mb-4">Articles</h2>

        {/* PUBLISHED */}

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Published</h3>

          <div className="flex flex-col gap-2">
            {published.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="hover:text-orange-600"
              >
                {article.title}
              </Link>
            ))}

            {published.length === 0 && (
              <p className="text-sm opacity-60">No published articles</p>
            )}
          </div>
        </div>

        {/* DRAFT */}

        <div>
          <h3 className="text-sm font-semibold mb-2">Draft</h3>

          <div className="flex flex-col gap-2">
            {drafts.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="hover:text-orange-600 opacity-80"
              >
                {article.title}
              </Link>
            ))}

            {drafts.length === 0 && (
              <p className="text-sm opacity-60">No draft articles</p>
            )}
          </div>
        </div>
      </div>

      {/* TAXONOMY */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* CATEGORIES */}

        <div className="os-card">
          <h2 className="font-semibold mb-4">Categories</h2>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="
                px-3 py-1
                text-xs
                bg-[#f4e8c7]
                rounded
                "
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        {/* TAGS */}

        <div className="os-card">
          <h2 className="font-semibold mb-4">Tags</h2>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="
                px-3 py-1
                text-xs
                bg-[#f4e8c7]
                rounded
                "
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MEDIA */}

      <div className="os-card">
        <h2 className="font-semibold mb-4">Media</h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {media.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt=""
              className="
              rounded
              cursor-pointer
              hover:opacity-80
              "
              onClick={() => setSelectedImage(img.url)}
            />
          ))}
        </div>
      </div>

      {/* IMAGE POPUP */}

      <PopUp
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Media Preview"
      >
        {selectedImage && (
          <img src={selectedImage} className="w-full rounded" />
        )}
      </PopUp>

      {/* CREATE CATEGORY POPUP */}

      <PopUp
        isOpen={openCategory}
        onClose={() => setOpenCategory(false)}
        title="Create Category"
      >
        <CreateCategoryForm brandId={id} onSuccess={createCategorySuccess} />
      </PopUp>

      {/* CREATE TAG POPUP */}

      <PopUp
        isOpen={openTag}
        onClose={() => setOpenTag(false)}
        title="Create Tag"
      >
        <CreateTagForm brandId={id} onSuccess={createTagSuccess} />
      </PopUp>

      {/* UPLOAD MEDIA POPUP */}

      <PopUp
        isOpen={openMedia}
        onClose={() => setOpenMedia(false)}
        title="Upload Media"
      >
        <UploadMediaForm brandId={id} onSuccess={uploadMediaSuccess} />
      </PopUp>
      {/* UPLOAD MEDIA POPUP */}

      <PopUp
        isOpen={openMedia}
        onClose={() => setOpenMedia(false)}
        title="Upload Media"
      >
        <UploadMediaForm brandId={id} onSuccess={uploadMediaSuccess} />
      </PopUp>

      {/* TOAST */}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />
    </div>
  );
}
