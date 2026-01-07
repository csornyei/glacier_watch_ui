import type { GeoJsonObject } from "geojson";

export type ProjectListItem = {
  project_id: string;
  name: string;
  point: [number, number];
};

export type ProjectList = {
  projects: ProjectListItem[];
  map_bounds: [[number, number], [number, number]];
};

export type Glacier = {
  glacier_id: string;
  name: string | null;
  point: [number, number];
};

export type Scene = {
  scene_id: string;
  acquisition_date: Date;
  status: string;
};

export type ProjectDetails = {
  project: {
    project_id: string;
    name: string;
    description: string;
    glaciers: Glacier[];
    scenes: Scene[];
    created_at: string;
    updated_at: string;
  };
  map_center: [number, number];
  map_bounds: [[number, number], [number, number]];
  scene_total_count: number;
};

export type GlacierDetails = {
  glacier_id: string;
  name: string | null;
  area_m2: number;
  geometry: GeoJsonObject;
};

export type GlacierTimeSeriesDataPoint = {
  snow_area_m2: number;
  snowline_elevation_m: number;
  snow_area_fraction: number;
  acquisition_date: string;
};

export type GlacierResponse = {
  glacier: GlacierDetails;
  timeseries: GlacierTimeSeriesDataPoint[];
};

export type GlacierLoaderResponse = GlacierResponse & {
  compare_glacier: GlacierResponse | null;
};

export type GeojsonData = {
  key: string;
  data: GeoJsonObject;
};

export interface SceneDetails extends Scene {
  attempts_download: number;
  attempts_processing: number;
  last_error: string | null;
  project_id: string;
}

export type ActionResponse = {
  success: boolean;
  message: string;
};

export type SceneStatus =
  | "queued_for_download"
  | "queued_for_processing"
  | "processed";

export type AllSceneStatuses =
  | "discovered"
  | "downloading"
  | "downloaded"
  | "failed_download"
  | "processing"
  | "failed_processing"
  | SceneStatus;
