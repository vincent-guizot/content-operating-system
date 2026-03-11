import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArticleEditor from "../../components/editors/TipTapEditor";
import ArticlePopUpMedia from "./components/ArticlePopUpMedia";
import { createArticle, getBrands, getCategories } from "../../services";
import Toast from "../../components/shared/feedback/Toast";
import UploadBox from "./components/UploadBox";
import InputTags from "./components/InputTags";
import CategorySelect from "./components/CategorySelect";
import BrandSelect from "./components/BrandSelect";

export default function CreateArticle() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [thumbnail, setThumbnail] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [tagInput, setTagInput] = useState("");
  const [mediaPopup, setMediaPopup] = useState(null);

  const [form, setForm] = useState({
    title: "",
    brandId: "",
    categoryId: "",
    excerpt: "",
    visibility: "Public",
    status: "Draft",
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    tags: [],
  });

  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  /* FETCH BRANDS */

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await getBrands();
      setBrands(res);
    };

    fetchBrands();
  }, []);

  /* FETCH CATEGORIES */

  useEffect(() => {
    if (!form.brandId) return;

    const fetchCategories = async () => {
      const res = await getCategories();

      setCategories(res.filter((c) => c.brandId === Number(form.brandId)));
    };

    fetchCategories();
  }, [form.brandId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const calculateReadingTime = (html) => {
    const words = html.replace(/<[^>]*>/g, "").split(/\s+/).length;

    return Math.ceil(words / 200);
  };

  const saveArticle = async (status) => {
    try {
      const readingTime = calculateReadingTime(content);

      const payload = {
        title: form.title,
        slug: generateSlug(form.title),

        brandId: Number(form.brandId),
        categoryId: Number(form.categoryId),

        content,
        author: "Vincent Guizot",

        status,
        visibility: form.visibility,

        ...(form.excerpt && { excerpt: form.excerpt }),

        ...(thumbnail?.url && { thumbnail: thumbnail.url }),
        ...(coverImage?.url && { coverImage: coverImage.url }),

        ...(readingTime && { readingTime }),

        ...(form.seoTitle && { seoTitle: form.seoTitle }),
        ...(form.seoDescription && { seoDescription: form.seoDescription }),
        ...(form.canonicalUrl && { canonicalUrl: form.canonicalUrl }),

        ...(form.tags?.length && { tags: form.tags }),
      };

      console.log("payload:", payload);

      await createArticle(payload);

      setToast({
        show: true,
        type: "success",
        message: "Article Saved Successfully!",
      });

      // navigate("/articles");
    } catch (error) {
      console.error(error.response?.data || error);

      setToast({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Failed to save article",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-[1fr_260px] gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Add New Article Title"
          className="w-full text-3xl font-bold bg-transparent border-b border-[#B08968] pb-2 outline-none"
        />

        <BrandSelect
          brands={brands}
          value={form.brandId}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6 min-h-[70vh]">
        <div className="flex flex-col gap-4">
          <ArticleEditor content={content} setContent={setContent} />

          <div className="os-card">
            <h3 className="font-semibold mb-2">Excerpt</h3>

            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              className="os-input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="os-card">
            <h3 className="font-semibold mb-3">Publish</h3>

            <div className="flex gap-2">
              <button
                onClick={() => saveArticle("Draft")}
                className="os-btn-secondary flex-1"
              >
                Save Draft
              </button>

              <button
                onClick={() => saveArticle("Published")}
                className="os-btn-primary flex-1"
              >
                Publish
              </button>
            </div>
          </div>

          <div className="os-card">
            <h3 className="font-semibold mb-3">Taxonomy</h3>

            <CategorySelect
              categories={categories}
              value={form.categoryId}
              onChange={handleChange}
            />

            <InputTags
              tags={form.tags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              setForm={setForm}
            />
          </div>

          <div className="os-card">
            <h3 className="font-semibold mb-3">Media</h3>

            <UploadBox
              label="Thumbnail"
              image={thumbnail}
              onClick={() => setMediaPopup("thumbnail")}
            />

            <UploadBox
              label="Cover Image"
              image={coverImage}
              onClick={() => setMediaPopup("cover")}
            />
          </div>

          <div className="os-card">
            <h3 className="font-semibold mb-3">SEO</h3>

            <input
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              placeholder="SEO Title"
              className="os-input mb-2"
            />

            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              placeholder="SEO Description"
              className="os-input mb-2"
              rows="3"
            />

            <input
              name="canonicalUrl"
              value={form.canonicalUrl}
              onChange={handleChange}
              placeholder="Canonical URL"
              className="os-input"
            />
          </div>
        </div>
      </div>

      {mediaPopup && (
        <ArticlePopUpMedia
          onClose={() => setMediaPopup(null)}
          onSelect={(media) => {
            if (mediaPopup === "thumbnail") setThumbnail(media);
            if (mediaPopup === "cover") setCoverImage(media);

            setMediaPopup(null);
          }}
        />
      )}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
