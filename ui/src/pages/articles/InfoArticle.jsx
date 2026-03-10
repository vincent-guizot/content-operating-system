import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getArticles, deleteArticle } from "../../services";

import ArticleHeader from "./components/ArticleHeader";
import ArticleMeta from "./components/ArticleMeta";
import ArticleTags from "./components/ArticleTags";
import ArticleInfo from "./components/ArticleInfo";

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const data = await getArticles();
      const found = data.find((a) => a.slug === slug);
      setArticle(found);
    };

    fetchArticle();
  }, [slug]);

  const handleDelete = async () => {
    if (!confirm("Delete this article?")) return;

    await deleteArticle(article.id);

    navigate("/articles");
  };

  if (!article) {
    return <div className="p-10 text-center">Article not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <ArticleHeader article={article} onDelete={handleDelete} />

      <ArticleMeta article={article} />

      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="rounded-lg mb-6 w-full"
        />
      )}

      <ArticleTags tags={article.tags} />

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <ArticleInfo article={article} />
    </div>
  );
}
