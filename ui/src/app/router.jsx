import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/dashboard/Dashboard";

// Articles
import Articles from "../pages/articles/Articles";
import CreateArticle from "../pages/articles/CreateArticle";
import EditArticle from "../pages/articles/EditArticle";
import InfoArticle from "../pages/articles/InfoArticle";

// Brands
import Brands from "../pages/brands/Brands";
import CreateBrand from "../pages/brands/CreateBrand";
import EditBrand from "../pages/brands/EditBrand";

// Categories
import Categories from "../pages/categories/Categories";
import CreateCategory from "../pages/categories/CreateCategory";
import EditCategory from "../pages/categories/EditCategory";

// Tags
import Tags from "../pages/tags/Tags";
import CreateTag from "../pages/tags/CreateTag";
import EditTag from "../pages/tags/EditTag";

// Media
import MediaLibrary from "../pages/media/MediaLibrary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      // ARTICLES
      {
        path: "articles",
        element: <Articles />,
      },
      {
        path: "articles/create",
        element: <CreateArticle />,
      },
      {
        path: "articles/:id/edit",
        element: <EditArticle />,
      },
      {
        path: "articles/:slug",
        element: <InfoArticle />,
      },
      // BRANDS
      {
        path: "brands",
        element: <Brands />,
      },
      {
        path: "brands/create",
        element: <CreateBrand />,
      },
      {
        path: "brands/:id/edit",
        element: <EditBrand />,
      },

      // CATEGORIES
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "categories/create",
        element: <CreateCategory />,
      },
      {
        path: "categories/:id/edit",
        element: <EditCategory />,
      },

      // MEDIA
      {
        path: "media",
        element: <MediaLibrary />,
      },

      // TAGS
      {
        path: "tags",
        element: <Tags />,
      },
      {
        path: "tags/create",
        element: <CreateTag />,
      },
      {
        path: "tags/:id/edit",
        element: <EditTag />,
      },
    ],
  },
]);
