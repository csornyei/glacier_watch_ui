import { List, ThemeIcon } from "@mantine/core";
import { MountainSnow } from "lucide-react";
import type { Glacier } from "../../utils/types";

import styles from "./panel.module.scss";
import { Link } from "react-router";
import { linkHelper } from "../../utils/linkHelper";

interface GlaciersPanelProps {
  projectId: string;
  glaciers: Glacier[];
}

const GlaciersPanel: React.FC<GlaciersPanelProps> = ({
  projectId,
  glaciers,
}) => {
  return (
    <List
      spacing="sm"
      size="sm"
      center
      icon={
        <ThemeIcon color="blue" size={20} radius="sm">
          <MountainSnow />
        </ThemeIcon>
      }
    >
      {glaciers.map((glacier) => (
        <List.Item key={glacier.glacier_id} className={styles.list_item}>
          <Link to={linkHelper.glacier(projectId, glacier.glacier_id)}>
            {glacier.name
              ? glacier.name
              : `Unnamed Glacier (${glacier.glacier_id})`}
          </Link>
        </List.Item>
      ))}
    </List>
  );
};

export default GlaciersPanel;
