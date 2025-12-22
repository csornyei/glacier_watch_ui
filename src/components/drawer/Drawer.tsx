import { ActionIcon, Box, NativeSelect } from "@mantine/core";
import { Link, useNavigate } from "react-router";

import type {
  ProjectDetails as ProjectDetailsType,
  ProjectList,
} from "../../utils/types";
import ProjectDetails from "./ProjectDetails";
import styles from "./drawer.module.scss";
import { CircleX } from "lucide-react";
import { linkHelper } from "../../utils/linkHelper";

interface DrawerProps {
  projects: ProjectList;
  selectedProject?: ProjectDetailsType;
  close: () => void;
}

const Drawer: React.FC<DrawerProps> = ({
  projects,
  selectedProject,
  close,
}) => {
  const navigate = useNavigate();
  return (
    <Box className={styles.drawer}>
      <Box className={styles.drawer_icons}>
        <ActionIcon
          variant="filled"
          aria-label="Close Drawer"
          color="rgba(0,0,0,0)"
          size="lg"
          onClick={close}
        >
          <CircleX size={20} color="rgb(0,0,0)" />
        </ActionIcon>
      </Box>
      <div>
        <h2>
          <Link to={linkHelper.root()}>Glacier Watch</Link>
        </h2>
      </div>
      <Box>
        <NativeSelect
          value={selectedProject?.project.project_id || ""}
          onChange={(event) => {
            navigate(`/p/${event.currentTarget.value}`);
          }}
          data={
            projects
              ? projects.projects.map((project) => ({
                  label: project.name,
                  value: project.project_id,
                }))
              : []
          }
          label="Projects"
        />
      </Box>
      {projects && selectedProject && (
        <ProjectDetails projectDetails={selectedProject} />
      )}
    </Box>
  );
};

export default Drawer;
