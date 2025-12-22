import { List, Tooltip } from "@mantine/core";
import type { Scene } from "../../utils/types";

import styles from "./panel.module.scss";
import { Link } from "react-router";
import { linkHelper } from "../../utils/linkHelper";
import { getIconForStatus } from "../../utils/helpers";

interface ScenesPanelProps {
  projectId: string;
  scenes: Scene[];
}

const ScenesPanel: React.FC<ScenesPanelProps> = ({ projectId, scenes }) => {
  return (
    <List
      spacing="sm"
      size="sm"
      center
      icon={getIconForStatus("unknown") /* Default icon for the list items */}
    >
      {scenes
        .sort((a, b) => {
          return (
            new Date(b.acquisition_date).getTime() -
            new Date(a.acquisition_date).getTime()
          );
        })
        .map((scene) => (
          <Tooltip
            label={`Status: ${scene.status}`}
            key={scene.scene_id}
            openDelay={500}
          >
            <List.Item
              icon={getIconForStatus(scene.status)}
              className={styles.list_item}
            >
              <Link to={linkHelper.scene(projectId, scene.scene_id)}>
                {scene.scene_id}
              </Link>
            </List.Item>
          </Tooltip>
        ))}
    </List>
  );
};

export default ScenesPanel;
