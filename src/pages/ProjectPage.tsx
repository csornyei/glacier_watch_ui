import { Link, useRouteLoaderData } from "react-router";
import { Accordion } from "@mantine/core";
import Map from "../components/Map";
import type { ProjectDetails } from "../utils/types";
import GlaciersPanel from "../components/drawer/GlaciersPanel";
import ScenesPanel from "../components/drawer/ScenesPanel";
import { linkHelper } from "../utils/linkHelper";

export default function ProjectPage() {
  const data = useRouteLoaderData<ProjectDetails>("project");

  if (!data) {
    return (
      <div>
        <h1>404 - Project not found!</h1>
        <h3>There is no project with this ID!</h3>
      </div>
    );
  }

  const projectDetails = data?.project;

  return (
    <div>
      <h3>Selected Project: {projectDetails.name}</h3>
      {projectDetails.description ? <p>{projectDetails.description}</p> : null}
      <Map
        bounds={data.map_bounds}
        markers={projectDetails.glaciers.map((glacier) => ({
          position: glacier.point,
          popupText: (
            <>
              {glacier.name ? glacier.name : "Unnamed Glacier"}{" "}
              <Link
                to={linkHelper.glacier(
                  projectDetails.project_id,
                  glacier.glacier_id
                )}
              >
                Go to glacier!
              </Link>
            </>
          ),
        }))}
      />
      <Accordion mb="md" defaultValue="glaciers">
        <Accordion.Item value="glaciers">
          <Accordion.Control>Glaciers</Accordion.Control>
          <Accordion.Panel>
            This project contains {projectDetails.glaciers.length} glaciers.
            <GlaciersPanel
              projectId={projectDetails.project_id}
              glaciers={projectDetails.glaciers}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="scenes">
          <Accordion.Control>Scenes</Accordion.Control>
          <Accordion.Panel>
            This project contains {data.scene_total_count} scenes (loaded:{" "}
            {projectDetails.scenes.length}).
            <ScenesPanel
              projectId={projectDetails.project_id}
              scenes={projectDetails.scenes}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      {/* <Grid>
        <Grid.Col span={4}>
          <GlaciersPanel
            projectId={projectDetails.project_id}
            glaciers={projectDetails.glaciers}
          />
        </Grid.Col>
        <Grid.Col span={8}>
          <ScenesPanel
            projectId={projectDetails.project_id}
            scenes={projectDetails.scenes}
          />
        </Grid.Col>
      </Grid> */}
    </div>
  );
}
