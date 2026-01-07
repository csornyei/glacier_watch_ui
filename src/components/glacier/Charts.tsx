import type { GlacierTimeSeriesDataPoint } from "../../utils/types";
import { getChartColor } from "../charts/chartColors";
import ResponsiveContainer from "../charts/ResponsiveContainer";

interface GlacierChartsProps {
  mainGlacierName: string;
  mainGlacierTimeseries: GlacierTimeSeriesDataPoint[];
  otherGlaciers: {
    name: string;
    timeseries: GlacierTimeSeriesDataPoint[];
  }[];
}

export default function GlacierCharts({
  mainGlacierName,
  mainGlacierTimeseries,
  otherGlaciers,
}: GlacierChartsProps) {
  const mainGlacierSeriesDetails = {
    label: mainGlacierName,
    color: getChartColor(0),
  };

  const snowAreaTimeseries = [
    {
      points: mainGlacierTimeseries.map((ts) => {
        return {
          x: new Date(ts.acquisition_date),
          y: Number((ts.snow_area_m2 / 1_000_000).toFixed(2)),
        };
      }),
      ...mainGlacierSeriesDetails,
    },
    ...otherGlaciers.map((glacier, index) => ({
      points: glacier.timeseries.map((ts) => {
        return {
          x: new Date(ts.acquisition_date),
          y: Number((ts.snow_area_m2 / 1_000_000).toFixed(2)),
        };
      }),
      label: glacier.name,
      color: getChartColor(index + 1),
    })),
  ];

  const snowlineElevationTimeseries = [
    {
      points: mainGlacierTimeseries.map((ts) => {
        return {
          x: new Date(ts.acquisition_date),
          y: Math.round(ts.snowline_elevation_m),
        };
      }),
      ...mainGlacierSeriesDetails,
    },
    ...otherGlaciers.map((glacier, index) => ({
      points: glacier.timeseries.map((ts) => {
        return {
          x: new Date(ts.acquisition_date),
          y: Math.round(ts.snowline_elevation_m),
        };
      }),
      label: glacier.name,
      color: getChartColor(index + 1),
    })),
  ];

  const snowAreaFractionTimeseries = [
    {
      points: mainGlacierTimeseries.map((ts) => {
        return {
          x: new Date(ts.acquisition_date),
          y: Number((ts.snow_area_fraction * 100).toFixed(2)),
        };
      }),
      ...mainGlacierSeriesDetails,
    },
    ...otherGlaciers.map((glacier, index) => ({
      points: glacier.timeseries.map((ts) => {
        return {
          x: new Date(ts.acquisition_date),
          y: Number((ts.snow_area_fraction * 100).toFixed(2)),
        };
      }),
      label: glacier.name,
      color: getChartColor(index + 1),
    })),
  ];

  return (
    <div>
      <h3>Time Series Data</h3>

      <ResponsiveContainer
        series={snowAreaTimeseries}
        label="Snow Area (km²)"
        meassure="km²"
      />
      <ResponsiveContainer
        series={snowlineElevationTimeseries}
        label="Snowline Elevation (m)"
        customYThreshold={20}
        meassure="m"
      />
      <ResponsiveContainer
        series={snowAreaFractionTimeseries}
        label="Snow Area Fraction"
        meassure="%"
      />
    </div>
  );
}
