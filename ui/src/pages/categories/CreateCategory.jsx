import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBrands } from "../../services/";
import { createCategory } from "../../services/";

export default function CreateCategory() {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    brandId: "",
  });

  useEffect(() => {
    const fetchBrands = async () => {
      const data = await getBrands();
      setBrands(data);
    };

    fetchBrands();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createCategory(form);

    navigate("/categories");
  };

  return (
    <div className="os-card max-w-lg">
      <h1 className="text-xl font-semibold mb-6">Create Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <div>
          <label className="os-label">Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="os-input"
            placeholder="Frontend"
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
            placeholder="frontend"
          />
        </div>

        {/* BRAND SELECT */}
        <div>
          <label className="os-label">Brand</label>

          <select
            name="brandId"
            value={form.brandId}
            onChange={handleChange}
            className="os-input"
          >
            <option value="">Select Brand</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="os-btn-primary">
          Save Category
        </button>
      </form>
    </div>
  );
}
