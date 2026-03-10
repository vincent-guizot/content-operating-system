import { useState } from "react";
import { createMedia } from "../../services";

export default function UploadMedia({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      await createMedia(formData);

      onSuccess?.();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="os-label">Select File</label>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="os-input"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="os-btn-primary w-full"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
