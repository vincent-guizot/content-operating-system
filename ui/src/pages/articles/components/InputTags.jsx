function InputTags({ tags, tagInput, setTagInput, setForm }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = tagInput.trim().toLowerCase();

      if (!value) return;

      setForm((prev) => {
        if (prev.tags.includes(value)) return prev;

        return {
          ...prev,
          tags: [...prev.tags, value],
        };
      });

      setTagInput("");
    }

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
    <div className="os-input flex flex-wrap gap-2 p-2 mt-2">
      {tags.map((tag) => (
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
        onKeyDown={handleKeyDown}
        placeholder="Type tag then press Enter"
        className="outline-none flex-1 text-sm bg-transparent"
      />
    </div>
  );
}

export default InputTags;
