import { Link, useRouteLoaderData } from "react-router";
import { List, ThemeIcon, Grid, Paper, Box } from "@mantine/core";
import type { ProjectList } from "../utils/types";
import { BookImage } from "lucide-react";
import { linkHelper } from "../utils/linkHelper";
import Map from "../components/Map";

export default function MainPage() {
  const data = useRouteLoaderData<ProjectList>("root");
  return (
    <Box w="100%" p="md" style={{ minWidth: 1200 }}>
      <h3>Select a project!</h3>
      <Grid>
        <Grid.Col span={8}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Map
              markers={data?.projects.map((project) => {
                return {
                  position: [project.point[0], project.point[1]],
                  popupText: (
                    <>
                      {" "}
                      {project.name}{" "}
                      <Link to={linkHelper.project(project.project_id)}>
                        View Project
                      </Link>
                    </>
                  ),
                };
              })}
              bounds={data?.map_bounds}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper withBorder shadow="sm" radius="md" p="md" mb="md">
            <List
              spacing="sm"
              size="lg"
              icon={
                <ThemeIcon color="blue" size={20} radius="sm">
                  <BookImage />
                </ThemeIcon>
              }
            >
              {data?.projects.map((project) => (
                <List.Item key={project.project_id}>
                  <Link to={linkHelper.project(project.project_id)}>
                    {project.name}
                  </Link>
                </List.Item>
              ))}
            </List>
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
