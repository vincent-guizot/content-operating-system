import { Grid, Table } from "lucide-react";

export default function DataToolbar({ view, setView, search, setSearch }) {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* LEFT */}

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="os-input w-60"
        />

        <select className="os-input w-44">
          <option>All Brands</option>
          <option>OrangeKode</option>
          <option>Sadino Technology</option>
          <option>Elevora Bootcamp</option>
          <option>Protein Shack</option>
          <option>Cookiefy</option>
        </select>

        <select className="os-input w-36">
          <option>Newest</option>
          <option>Oldest</option>
          <option>Most Views</option>
        </select>

        <select className="os-input w-36">
          <option>Published</option>
          <option>Draft</option>
          <option>All</option>
        </select>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("grid")}
          className={`os-btn-outline p-2 ${
            view === "grid" ? "os-nav-active" : ""
          }`}
        >
          <Grid size={16} />
        </button>

        <button
          onClick={() => setView("table")}
          className={`os-btn-outline p-2 ${
            view === "table" ? "os-nav-active" : ""
          }`}
        >
          <Table size={16} />
        </button>
      </div>
    </div>
  );
}
