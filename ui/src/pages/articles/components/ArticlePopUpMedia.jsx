import { useEffect, useState } from "react";

import { getMedia, createMedia } from "../../../services";

const ArticlePopUpMedia = ({ onClose, onSelect }) => {
  const [medias, setMedias] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      const data = await getMedia();
      setMedias(data);
    } catch (err) {
      console.error("Failed to fetch media", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      setUploading(true);

      const newMedia = await createMedia(formData);

      setUploading(false);

      setMedias((prev) => [newMedia, ...prev]);
    } catch (err) {
      console.error("Upload failed", err);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] rounded p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Media Library</h2>

          <button onClick={onClose}>✕</button>
        </div>

        {/* Upload */}

        <div className="mb-4">
          <input type="file" onChange={handleUpload} />

          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>

        {/* Media Grid */}

        <div className="grid grid-cols-5 gap-3 max-h-[400px] overflow-y-auto">
          {medias.map((m) => (
            <img
              key={m.id}
              src={m.url}
              onClick={() => onSelect(m)}
              className="cursor-pointer border rounded hover:border-black object-cover w-full h-24"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlePopUpMedia;
