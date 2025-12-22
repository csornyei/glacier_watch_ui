/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AspectRatio } from "@mantine/core";
import TimeSeriesLineChart from "./TimeSeriesLineChart";
import type { TimeSeriesLineChartProps } from "./TimeSeriesLineChart";

interface ResponsiveContainerProps
  extends Omit<TimeSeriesLineChartProps, "width" | "height"> {}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = (props) => {
  return (
    <AspectRatio ratio={16 / 9}>
      <div style={{ width: "100%", height: "100%" }}>
        <TimeSeriesLineChart {...props} />
      </div>
    </AspectRatio>
  );
};

export default ResponsiveContainer;
