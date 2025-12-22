import { Flex, Table } from "@mantine/core";
import { getIconForStatus } from "../../utils/helpers";
import type { SceneDetails } from "../../utils/types";

type SceneDetailsTableProps = {
  scene: SceneDetails;
};

export default function SceneDetailsTable({ scene }: SceneDetailsTableProps) {
  return (
    <Table>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Status:</Table.Td>
          <Table.Td>
            <Flex align="center" justify="center" gap="xs">
              {getIconForStatus(scene.status)} {scene.status}
            </Flex>
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>Acquisition Date:</Table.Td>
          <Table.Td>
            {new Date(scene.acquisition_date).toLocaleDateString()}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>Download Attempts:</Table.Td>
          <Table.Td>{scene.attempts_download}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>Processing Attempts:</Table.Td>
          <Table.Td>{scene.attempts_processing}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>Last Error:</Table.Td>
          <Table.Td>{scene.last_error ? scene.last_error : "None"}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
