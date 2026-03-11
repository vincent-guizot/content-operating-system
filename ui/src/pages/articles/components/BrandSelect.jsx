function BrandSelect({ brands = [], value, onChange }) {
  return (
    <select
      name="brandId"
      value={value}
      onChange={onChange}
      className="os-input"
    >
      <option value="">Select Brand</option>

      {brands.map((brand) => (
        <option key={brand.id} value={brand.id}>
          {brand.name}
        </option>
      ))}
    </select>
  );
}

export default BrandSelect;
