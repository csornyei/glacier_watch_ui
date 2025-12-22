import { ThemeIcon } from "@mantine/core";
import { CircleCheck, Cloud, CloudDownload, CircleX, Cog } from "lucide-react";

export const getIconForStatus = (status: string) => {
  switch (status) {
    case "discovered":
    case "queued_for_download":
      return (
        <ThemeIcon color="gray" size={20} radius="sm">
          <Cloud />
        </ThemeIcon>
      );
    case "downloading":
      return (
        <ThemeIcon color="blue" size={20} radius="sm">
          <CloudDownload />
        </ThemeIcon>
      );
    case "downloaded":
    case "queued_for_processing":
      return (
        <ThemeIcon color="blue" size={20} radius="sm">
          <CircleCheck />
        </ThemeIcon>
      );
    case "failed_download":
    case "failed_processing":
      return (
        <ThemeIcon color="red" size={20} radius="sm">
          <CircleX />
        </ThemeIcon>
      );
    case "processing":
      return (
        <ThemeIcon color="yellow" size={20} radius="sm">
          <Cog />
        </ThemeIcon>
      );
    case "processed":
      return (
        <ThemeIcon color="green" size={20} radius="sm">
          <CircleCheck />
        </ThemeIcon>
      );
    default:
      return (
        <ThemeIcon color="gray" size={20} radius="sm">
          <CircleX />
        </ThemeIcon>
      );
  }
};
