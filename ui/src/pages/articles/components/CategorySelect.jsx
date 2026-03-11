function CategorySelect({ categories = [], value, onChange }) {
  return (
    <select
      name="categoryId"
      value={value}
      onChange={onChange}
      className="os-input"
    >
      <option value="">Select Category</option>

      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

export default CategorySelect;
