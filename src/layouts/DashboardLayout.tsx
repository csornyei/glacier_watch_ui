import { AppShell } from "@mantine/core";
import { Outlet, useRouteLoaderData } from "react-router";

import Drawer from "../components/drawer/Drawer";

import type {
  GlacierResponse,
  ProjectDetails,
  ProjectList,
  SceneDetails,
} from "../utils/types";
import { useDisclosure } from "@mantine/hooks";
import Header from "../components/Header";

function DashboardLayout() {
  const [opened, { open, close }] = useDisclosure(false);
  const data = useRouteLoaderData<ProjectList>("root") as ProjectList;
  const dataProjectDetails = useRouteLoaderData<ProjectDetails>("project");

  const glacierDetails = useRouteLoaderData<GlacierResponse>("glacier");
  const sceneDetails = useRouteLoaderData<{ scene: SceneDetails }>("scene");

  return (
    <AppShell
      header={{ height: opened ? 0 : 40 }}
      navbar={
        opened
          ? {
              width: 300,
              breakpoint: "sm",
              collapsed: {
                desktop: false,
                mobile: false,
              },
            }
          : undefined
      }
    >
      {opened ? (
        <AppShell.Navbar
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Drawer
            projects={data}
            selectedProject={dataProjectDetails}
            close={close}
          />
        </AppShell.Navbar>
      ) : (
        <AppShell.Header>
          <Header
            projectDetails={dataProjectDetails?.project}
            openDrawer={open}
            opened={opened}
            glacier={
              glacierDetails
                ? {
                    glacier_id: glacierDetails.glacier.glacier_id,
                    name: glacierDetails.glacier.name
                      ? glacierDetails.glacier.name
                      : "Unnamed Glacier",
                  }
                : undefined
            }
            scene={
              sceneDetails
                ? {
                    scene_id: sceneDetails.scene.scene_id,
                  }
                : undefined
            }
          />
        </AppShell.Header>
      )}

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;
