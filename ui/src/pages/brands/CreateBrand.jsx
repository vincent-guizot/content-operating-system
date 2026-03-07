import { useState } from "react";
import { createBrand } from "../../services";

export default function CreateBrandForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      name: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createBrand(form);

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* BRAND NAME */}

      <div>
        <label className="os-label">Brand Name</label>

        <input
          value={form.name}
          onChange={handleChange}
          className="os-input"
          placeholder="Orange Kode"
        />
      </div>

      <button className="os-btn-primary">Save Brand</button>
    </form>
  );
}
