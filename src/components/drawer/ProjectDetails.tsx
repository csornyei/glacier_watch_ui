import { Box, ScrollArea, Tabs } from "@mantine/core";

import type { ProjectDetails as ProjectDetailsType } from "../../utils/types";
import GlaciersPanel from "./GlaciersPanel";
import ScenesPanel from "./ScenesPanel";

import styles from "./drawer.module.scss";

interface ProjectDetailsProps {
  projectDetails: ProjectDetailsType;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectDetails }) => {
  return (
    <Box h="100%" className={styles.drawer_details}>
      <h3>{projectDetails.name}</h3>

      <Tabs defaultValue="glaciers" variant="pills" keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="glaciers">Glaciers</Tabs.Tab>
          <Tabs.Tab value="scenes">Scenes</Tabs.Tab>
        </Tabs.List>
        <ScrollArea.Autosize
          w={280}
          mah="calc(100% - 250px)"
          type="auto"
          mx="auto"
          overscrollBehavior="contain"
          offsetScrollbars
          scrollbarSize={6}
          className={styles.drawer_details_scrollarea}
        >
          <Tabs.Panel value="glaciers" pt="xs">
            <GlaciersPanel
              projectId={projectDetails.project_id}
              glaciers={projectDetails.glaciers}
            />
          </Tabs.Panel>
          <Tabs.Panel value="scenes" pt="xs">
            <ScenesPanel
              projectId={projectDetails.project_id}
              scenes={projectDetails.scenes}
            />
          </Tabs.Panel>
        </ScrollArea.Autosize>
      </Tabs>
    </Box>
  );
};

export default ProjectDetails;
