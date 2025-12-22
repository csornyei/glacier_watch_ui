import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "leaflet/dist/leaflet.css";
import "./index.css";

import MainLayout from "./layouts/MainLayout.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";

import MainPage from "./pages/MainPage.tsx";
import ProjectPage from "./pages/ProjectPage.tsx";
import GlacierPage from "./pages/GlacierPage.tsx";
import ScenePage from "./pages/ScenePage.tsx";

import actions from "./utils/actions.ts";
import loaders from "./utils/loaders.ts";
import "./utils/leafletFix.ts";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader: loaders.projects,
    children: [
      {
        Component: MainLayout,
        children: [{ index: true, Component: MainPage }],
      },

      // /p/:project_id
      {
        id: "project",
        path: "p/:project_id",
        loader: loaders.projectDetails,
        children: [
          {
            Component: MainLayout,
            children: [{ index: true, Component: ProjectPage }],
          },

          {
            Component: DashboardLayout,
            children: [
              // /p/:project_id/glacier/:glacier_id
              {
                id: "glacier",
                path: "glacier/:glacier_id",
                Component: GlacierPage,
                loader: loaders.glacierDetails,
              },
              // /p/:project_id/scene/:scene_id
              {
                id: "scene",
                path: "scene/:scene_id",
                Component: ScenePage,
                loader: loaders.sceneDetails,
                action: actions.updateSceneStatus,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);
