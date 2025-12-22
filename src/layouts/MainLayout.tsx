import { AppShell } from "@mantine/core";
import { Outlet, useRouteLoaderData } from "react-router";

import type { ProjectDetails } from "../utils/types";

import Header from "../components/Header";

function MainLayout() {
  const data = useRouteLoaderData<ProjectDetails>("project");

  return (
    <AppShell
      header={{
        height: 40,
      }}
    >
      <AppShell.Header>
        <Header projectDetails={data?.project} />
      </AppShell.Header>
      <AppShell.Main
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "block",
        }}
      >
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default MainLayout;
