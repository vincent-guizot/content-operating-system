import { useEffect, useState } from "react";
import { getBrands, createCategory } from "../../services";

export default function CreateCategoryForm({ onSuccess }) {
  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    name: "",
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

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* CATEGORY NAME */}
      <div>
        <label className="os-label">Category Name</label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="os-input"
          placeholder="Frontend"
        />
      </div>

      {/* BRAND */}
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

      <button className="os-btn-primary">Save Category</button>
    </form>
  );
}
