import { Box, Checkbox, List, ThemeIcon } from "@mantine/core";
import { MountainSnow } from "lucide-react";
import type { Glacier } from "../../utils/types";

import styles from "./panel.module.scss";
import { Link } from "react-router";
import { linkHelper, parseUrl } from "../../utils/linkHelper";
import { useState, type FC } from "react";

interface GlaciersPanelProps {
  projectId: string;
  glaciers: Glacier[];
}

const GlaciersPanel: FC<GlaciersPanelProps> = ({ projectId, glaciers }) => {
  const [isComparing, setIsComparing] = useState(false);

  const urlDetails = parseUrl();

  return (
    <>
      {urlDetails.glacierId && (
        <Box mb="md">
          <Checkbox
            label="Compare"
            checked={isComparing}
            onChange={(event) => setIsComparing(event.currentTarget.checked)}
          />
        </Box>
      )}
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
        {glaciers.map((glacier) => {
          const link =
            isComparing && urlDetails.glacierId
              ? linkHelper.glacier(
                  projectId,
                  urlDetails.glacierId,
                  glacier.glacier_id
                )
              : linkHelper.glacier(projectId, glacier.glacier_id);

          return (
            <List.Item key={glacier.glacier_id} className={styles.list_item}>
              <Link to={link}>
                {glacier.name
                  ? glacier.name
                  : `Unnamed Glacier (${glacier.glacier_id})`}
              </Link>
            </List.Item>
          );
        })}
      </List>
    </>
  );
};

export default GlaciersPanel;
