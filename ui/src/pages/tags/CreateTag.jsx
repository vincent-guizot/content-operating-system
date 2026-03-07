import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTag } from "../../services";
import { getCategories } from "../../services";

export default function CreateTag() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTag(form);

    navigate("/tags");
  };

  return (
    <div className="os-card max-w-lg">
      <h1 className="text-xl font-semibold mb-6">Create Tag</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <div>
          <label className="os-label">Tag Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="os-input"
            placeholder="React"
          />
        </div>

        {/* SLUG */}
        <div>
          <label className="os-label">Slug</label>

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="os-input"
            placeholder="react"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="os-label">Category</label>

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="os-input"
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="os-btn-primary">
          Save Tag
        </button>
      </form>
    </div>
  );
}
