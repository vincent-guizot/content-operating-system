import { useEffect, useState } from "react";
import { FileText, Tag, Layers, Image, Building } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  getArticles,
  getBrands,
  getCategories,
  getTags,
  getMedia,
} from "../../services";

export default function Dashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    brands: 0,
    categories: 0,
    tags: 0,
    media: 0,
  });

  const [published, setPublished] = useState([]);
  const [draft, setDraft] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articles, brands, categories, tags, media] = await Promise.all([
          getArticles(),
          getBrands(),
          getCategories(),
          getTags(),
          getMedia(),
        ]);

        setStats({
          articles: articles.length,
          brands: brands.length,
          categories: categories.length,
          tags: tags.length,
          media: media.length,
        });

        setPublished(
          articles.filter((a) => a.status === "Published").slice(0, 5),
        );

        setDraft(articles.filter((a) => a.status === "Draft").slice(0, 5));
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: "Articles", value: stats.articles, icon: FileText },
    { title: "Brands", value: stats.brands, icon: Building },
    { title: "Categories", value: stats.categories, icon: Layers },
    { title: "Tags", value: stats.tags, icon: Tag },
    { title: "Media", value: stats.media, icon: Image },
  ];

  const brands = [
    {
      id: 1,
      name: "Orange Kode",
    },
    {
      id: 2,
      name: "Sadino Technology",
    },
    {
      id: 3,
      name: "Elevora Bootcamp",
    },
    {
      id: 4,
      name: "Protein Shack",
    },
    {
      id: 5,
      name: "Cookiefy",
    },
  ];

  return (
    <div>
      {/* HEADER */}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orange Scrolls</h1>
          <p className="text-sm opacity-70">Knowledge Engine Dashboard</p>
        </div>

        {/* BRAND SHORTCUT */}

        <div className="flex gap-2 flex-wrap justify-end">
          {brands.map((brand, i) => (
            <Link
              key={i}
              to={`/brands/${brand.id}/detail`}
              className="text-xs border border-[#B08968] px-3 py-1 rounded hover:bg-[#e7d6b2]"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>

      {/* SYSTEM OVERVIEW */}

      <div className="os-card mb-8">
        <h2 className="text-lg font-semibold mb-2">System Overview</h2>

        <p className="text-sm opacity-80">
          Orange Scrolls powers internal content management for multiple brands
          including OrangeKode, Sadino Technology, Elevora Bootcamp, Protein
          Shack, and Cookiefy.
        </p>
      </div>

      {/* STATS */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-10">
        {cards.map((card, i) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="os-card"
            >
              <div className="flex justify-between mb-3">
                <Icon size={20} className="opacity-70" />
              </div>

              <div className="text-3xl font-bold">{card.value}</div>

              <div className="text-sm opacity-70">{card.title}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ARTICLES SECTION */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* PUBLISHED */}

        <div className="os-card">
          <h2 className="text-lg font-semibold mb-4">Published Articles</h2>

          <div className="space-y-2">
            {published.map((a) => (
              <div
                key={a.id}
                className="text-sm border-b border-[#e3d3a9] pb-1"
              >
                {a.title}
              </div>
            ))}
          </div>
        </div>

        {/* DRAFT */}

        <div className="os-card">
          <h2 className="text-lg font-semibold mb-4">Draft Articles</h2>

          <div className="space-y-2">
            {draft.map((a) => (
              <div
                key={a.id}
                className="text-sm border-b border-[#e3d3a9] pb-1"
              >
                {a.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
