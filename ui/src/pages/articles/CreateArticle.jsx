import { useState, useEffect } from "react";

import ArticleEditor from "../../components/editors/TipTapEditor";

import { createArticle, getBrands, getCategories } from "../../services";

export default function CreateArticle() {
  const [content, setContent] = useState("");

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    brandId: "",
    categoryId: "",
    status: "Draft",
    visibility: "Public",
    excerpt: "",
    tags: [],
  });

  // fetch brands

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await getBrands();

      setBrands(res);
    };

    fetchBrands();
  }, []);

  // fetch categories by brand

  useEffect(() => {
    if (!form.brandId) return;

    const fetchCategories = async () => {
      const res = await getCategories({
        brandId: form.brandId,
      });

      setCategories(res);
    };

    fetchCategories();
  }, [form.brandId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const publishArticle = async () => {
    await saveArticle("Published");
  };

  const saveDraft = async () => {
    await saveArticle("Draft");
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
      const now = new Date().toISOString();

      const payload = {
        id: crypto.randomUUID(),

        title: form.title,
        slug: generateSlug(form.title),

        brandId: form.brandId,
        categoryId: form.categoryId,

        tags: form.tags || [],

        excerpt: form.excerpt,
        content,

        thumbnail: "",
        coverImage: "",

        author: "Vincent Guizot",

        status: form.status,
        visibility: form.visibility,

        views: 0,
        readingTime: calculateReadingTime(content),

        seoTitle: form.title,
        seoDescription: form.excerpt,
        seoKeywords: [],

        canonicalUrl: "",

        publishedAt: status === "Published" ? now : null,
        scheduledAt: null,

        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };

      await createArticle(payload);

      alert("Article saved successfully!");
    } catch (error) {
      console.error("Error saving article:", error);

      alert("Failed to save article");
    }
  };

  // handle tags input
  // 🔴 FIX handleTagKeyDown

  const handleTagKeyDown = (e) => {
    // create tag when ENTER or COMMA
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const value = tagInput.trim();

      if (!value) return;

      // 🟢 NEW prevent duplicate tags
      if (form.tags.includes(value)) {
        setTagInput("");
        return;
      }

      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, value],
      }));

      setTagInput("");
    }

    // 🟢 NEW delete last tag with backspace
    if (e.key === "Backspace" && tagInput === "") {
      setForm((prev) => ({
        ...prev,
        tags: prev.tags.slice(0, -1),
      }));
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* TITLE + BRAND */}

      <div className="grid grid-cols-[1fr_260px] gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Add New Article Title"
          className="
          w-full
          text-3xl
          font-bold
          bg-transparent
          border-b
          border-[#B08968]
          pb-2
          outline-none
        "
        />

        <BrandSelect
          brands={brands}
          value={form.brandId}
          onChange={handleChange}
        />
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-[1fr_320px] gap-6 min-h-[70vh]">
        {/* LEFT */}

        <div className="flex flex-col gap-4">
          <ArticleEditor content={content} setContent={setContent} />

          <div className="os-card">
            <h3 className="font-semibold mb-2">Excerpt</h3>

            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Short summary of the article..."
              className="os-input"
              rows="3"
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR */}

        <div className="flex flex-col gap-4">
          {/* PUBLISH */}

          <div className="os-card">
            <h3 className="font-semibold mb-3">Publish</h3>

            <div className="flex gap-2">
              <button onClick={saveDraft} className="os-btn-secondary flex-1">
                Save Draft
              </button>

              <button
                onClick={publishArticle}
                className="os-btn-primary flex-1"
              >
                Publish
              </button>
            </div>

            <p className="text-xs opacity-60 mt-2">
              Current status: {form.status}
            </p>
          </div>

          {/* TAXONOMY */}

          <div className="os-card">
            <h3 className="font-semibold mb-3">Taxonomy</h3>

            <CategorySelect
              categories={categories}
              value={form.categoryId}
              brandId={form.brandId}
              onChange={handleChange}
            />

            {/* <InputTags /> */}
            <div className="os-input flex flex-wrap gap-2 p-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#e7d6b2] px-2 py-1 text-xs rounded flex items-center gap-1"
                >
                  {tag}

                  <button
                    onClick={() => removeTag(tag)}
                    className="text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type tag then press Enter..."
                className="outline-none flex-1 text-sm bg-transparent"
              />
            </div>
          </div>

          {/* MEDIA */}

          <div className="os-card">
            <h3 className="font-semibold mb-3">Media</h3>

            <UploadBox label="Thumbnail" />

            <UploadBox label="Cover Image" />
          </div>

          {/* SEO */}

          <div className="os-card">
            <h3 className="font-semibold mb-3">SEO</h3>

            <input placeholder="SEO Title" className="os-input mb-2" />

            <textarea placeholder="SEO Description" className="os-input mb-2" />

            <input placeholder="SEO Keywords" className="os-input" />
          </div>

          {/* SETTINGS */}

          <div className="os-card">
            <h3 className="font-semibold mb-3">Settings</h3>

            <select
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className="os-input"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandSelect({ brands = [], value, onChange }) {
  return (
    <select
      name="brandId"
      value={value}
      onChange={onChange}
      className="os-input"
    >
      <option value="">Select Brand</option>

      {brands.map((b) => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ))}
    </select>
  );
}

function CategorySelect({ categories = [], value, onChange, brandId }) {
  return (
    <select
      name="categoryId"
      value={value}
      onChange={onChange}
      className="os-input"
    >
      <option value="">Select Category</option>

      {categories.map((c) =>
        brandId === c.brandId ? (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ) : null,
      )}
    </select>
  );
}

function UploadBox({ label }) {
  return (
    <div className="border border-dashed border-[#B08968] rounded p-4 mb-3 text-center">
      <p className="text-sm mb-2">{label}</p>

      <input type="file" />
    </div>
  );
}

function InputTags() {
  return (
    <div className="os-input flex flex-wrap gap-2 p-2">
      {form.tags.map((tag) => (
        <span
          key={tag}
          className="bg-[#e7d6b2] px-2 py-1 text-xs rounded flex items-center gap-1"
        >
          {tag}

          <button onClick={() => removeTag(tag)} className="text-red-600">
            ×
          </button>
        </span>
      ))}

      <input
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagKeyDown}
        placeholder="Add tag..."
        className="outline-none flex-1 text-sm bg-transparent"
      />
    </div>
  );
}
