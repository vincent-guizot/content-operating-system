function UploadBox({ label, image, onClick }) {
  return (
    <div
      onClick={onClick}
      className="border border-dashed border-[#B08968] rounded p-4 mb-3 text-center cursor-pointer hover:bg-[#f5e9d8]"
    >
      {image ? (
        <img src={image.url} className="w-full h-32 object-cover rounded" />
      ) : (
        <>
          <p className="text-sm mb-2">{label}</p>
          <p className="text-xs opacity-60">Click to select media</p>
        </>
      )}
    </div>
  );
}

export default UploadBox;
