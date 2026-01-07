import { Box, Checkbox, List, ThemeIcon } from "@mantine/core";
import { MountainSnow } from "lucide-react";
import type { Glacier } from "../../utils/types";

import styles from "./panel.module.scss";
import { Link, useNavigate } from "react-router";
import { linkHelper, parseUrl } from "../../utils/linkHelper";
import { useEffect, useState, type FC } from "react";

interface GlaciersPanelProps {
  projectId: string;
  glaciers: Glacier[];
}

const GlacierLinkList = ({ projectId, glaciers }: GlaciersPanelProps) => {
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

interface GlacierCompareListProps extends GlaciersPanelProps {
  currentGlacierId?: string;
  comparingGlaciers?: string[];
  setComparingGlaciers?: (glacierIds: string[]) => void;
}

const GlacierCompareList = ({
  glaciers,
  currentGlacierId,
  comparingGlaciers,
  setComparingGlaciers,
}: GlacierCompareListProps) => {
  return glaciers.map((glacier) => (
    <Box key={glacier.glacier_id} mb="sm">
      <Checkbox
        label={
          glacier.name
            ? glacier.name
            : `Unnamed Glacier (${glacier.glacier_id})`
        }
        value={glacier.glacier_id}
        disabled={glacier.glacier_id === currentGlacierId}
        checked={
          glacier.glacier_id === currentGlacierId ||
          (comparingGlaciers
            ? comparingGlaciers.includes(glacier.glacier_id)
            : false)
        }
        onChange={(event) => {
          if (!setComparingGlaciers) return;

          const isChecked = event.currentTarget.checked;
          if (isChecked) {
            setComparingGlaciers([
              ...(comparingGlaciers ? comparingGlaciers : []),
              glacier.glacier_id,
            ]);
          } else {
            console.log("UNCHECKING");
            setComparingGlaciers(
              comparingGlaciers
                ? comparingGlaciers.filter((id) => id !== glacier.glacier_id)
                : []
            );
          }
        }}
      />
    </Box>
  ));
};

const GlaciersPanel: FC<GlaciersPanelProps> = ({ projectId, glaciers }) => {
  const urlDetails = parseUrl();

  const [isComparing, setIsComparing] = useState(urlDetails.compare.length > 0);
  const [compareGlaciers, setCompareGlaciers] = useState<string[]>(
    urlDetails.compare
  );
  const navigate = useNavigate();

  const disableComparing = () => {
    setIsComparing(false);
    setCompareGlaciers([]);
    navigate(linkHelper.glacier(projectId, urlDetails.glacierId!), {
      replace: true,
    });
  };

  useEffect(() => {
    if (urlDetails.glacierId) {
      if (isComparing) {
        if (compareGlaciers.length === 0) {
          navigate(linkHelper.glacier(projectId, urlDetails.glacierId), {
            replace: true,
          });
          return;
        }
        const compareParam = compareGlaciers.join(",");
        navigate(
          linkHelper.glacier(projectId, urlDetails.glacierId!, compareParam),
          { replace: true }
        );
      }
    }
  }, [compareGlaciers, isComparing, navigate, projectId, urlDetails.glacierId]);

  return (
    <>
      {urlDetails.glacierId && (
        <Box mb="md">
          <Checkbox
            label="Compare"
            checked={isComparing}
            onChange={(event) => {
              if (!event.currentTarget.checked) {
                disableComparing();
                return;
              }
              setIsComparing(event.currentTarget.checked);
            }}
          />
        </Box>
      )}
      {isComparing ? (
        <GlacierCompareList
          projectId={projectId}
          glaciers={glaciers}
          currentGlacierId={urlDetails.glacierId}
          comparingGlaciers={compareGlaciers}
          setComparingGlaciers={setCompareGlaciers}
        />
      ) : (
        <GlacierLinkList projectId={projectId} glaciers={glaciers} />
      )}
    </>
  );
};

export default GlaciersPanel;
