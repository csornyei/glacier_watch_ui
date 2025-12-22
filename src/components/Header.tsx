import { Link } from "react-router";
import { Burger, Flex } from "@mantine/core";
import styles from "./header.module.scss";
import { linkHelper } from "../utils/linkHelper";

interface HeaderProps {
  projectDetails?: {
    project_id: string;
    name: string;
  };
  opened?: boolean;
  openDrawer?: () => void;
  glacier?: {
    glacier_id: string;
    name: string;
  };
  scene?: {
    scene_id: string;
  };
}

export default function Header({
  projectDetails,
  opened,
  openDrawer,
  glacier,
  scene,
}: HeaderProps) {
  return (
    <Flex direction="row" align="center" gap="sm" className={styles.header}>
      {openDrawer ? (
        <Burger opened={opened} onClick={openDrawer} size="sm" />
      ) : null}
      <h2>
        <Link to={linkHelper.root()}>Glacier Watch</Link>
      </h2>

      {projectDetails ? (
        <>
          &nbsp; &gt;&nbsp;
          <h3>
            <Link to={linkHelper.project(projectDetails.project_id)}>
              {projectDetails.name}
            </Link>
          </h3>
          {glacier ? (
            <>
              &nbsp; &gt;&nbsp;
              <h3>
                <Link
                  to={linkHelper.glacier(
                    projectDetails.project_id,
                    glacier.glacier_id
                  )}
                >
                  {glacier.name}
                </Link>
              </h3>
            </>
          ) : null}
          {scene ? (
            <>
              &nbsp; &gt;&nbsp;
              <h3>
                <Link
                  to={linkHelper.scene(
                    projectDetails.project_id,
                    scene.scene_id
                  )}
                >
                  Scene: {scene.scene_id}
                </Link>
              </h3>
            </>
          ) : null}
        </>
      ) : null}
    </Flex>
  );
}
