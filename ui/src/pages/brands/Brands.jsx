import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import DataToolbar from "../../components/shared/ui/DataToolbar";
import DataTable from "../../components/shared/ui/DataTable";

import useSearch from "../../hooks/useSearch";

import { getBrands } from "../../services";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);

  // FETCH BRANDS

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const { query, setQuery, filteredData } = useSearch(brands, ["name"]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Brand Name" },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/brands/${row.id}/edit`}>
            <Pencil size={14} />
          </Link>

          <button className="text-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="text-sm opacity-70">Loading brands...</div>;
  }

  return (
    <div>
      {/* HEADER */}

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>

        <Link to="/brands/create" className="os-btn-primary">
          + Create Brand
        </Link>
      </div>

      {/* TOOLBAR */}

      <DataToolbar
        view={view}
        setView={setView}
        search={query}
        setSearch={setQuery}
      />

      {/* TABLE */}

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
