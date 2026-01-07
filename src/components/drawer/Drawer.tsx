import { Box, NativeSelect } from "@mantine/core";
import { Link, useNavigate } from "react-router";

import type {
  ProjectDetails as ProjectDetailsType,
  ProjectList,
} from "../../utils/types";
import ProjectDetails from "./ProjectDetails";
import styles from "./drawer.module.scss";
import { linkHelper } from "../../utils/linkHelper";

interface DrawerProps {
  projects: ProjectList;
  selectedProject?: ProjectDetailsType;
}

const Drawer: React.FC<DrawerProps> = ({ projects, selectedProject }) => {
  const navigate = useNavigate();
  return (
    <Box className={styles.drawer}>
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
