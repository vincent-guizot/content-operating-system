import {
  Pencil,
  Trash2,
  FileText,
  Tag,
  Layers,
  Image,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BrandCard({
  brand,
  articleCount,
  categoryCount,
  tagCount,
  mediaCount,
  onDelete,
}) {
  const max = Math.max(articleCount, categoryCount, tagCount, mediaCount, 1);

  const stats = [
    {
      label: "Articles",
      value: articleCount,
      icon: <FileText size={16} />,
    },
    {
      label: "Categories",
      value: categoryCount,
      icon: <Layers size={16} />,
    },
    {
      label: "Tags",
      value: tagCount,
      icon: <Tag size={16} />,
    },
    {
      label: "Media",
      value: mediaCount,
      icon: <Image size={16} />,
    },
  ];

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className="os-card flex flex-col gap-4"
    >
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{brand.name}</h2>

        <div className="flex gap-2">
          <Link to={`/brands/${brand.id}/detail`}>
            <Eye size={12} />
          </Link>
          <Link to={`/brands/${brand.id}/edit`}>
            <Pencil size={12} />
          </Link>

          <button onClick={() => onDelete(brand)} className="text-red-600">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="border-t border-[#e3d3a9]" />

      {/* STATS */}

      <div className="flex flex-col gap-3">
        {stats.map((stat) => {
          const percent = (stat.value / max) * 100;

          return (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  {stat.label}
                </div>

                <span className="font-semibold">{stat.value}</span>
              </div>

              <div className="h-2 bg-[#f4e8c7] rounded">
                <div
                  className="h-2 bg-orange-400 rounded"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
