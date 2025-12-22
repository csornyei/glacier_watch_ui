/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import type { AxiosInstance } from "axios";
import type {
  ProjectList,
  ProjectDetails,
  GlacierResponse,
  GlacierTimeSeriesDataPoint,
  SceneDetails,
} from "./types";

class DataSource {
  async getProjects(): Promise<ProjectList> {
    throw new Error("Method not implemented.");
  }

  async getProjectDetails(
    projectId: string,
    _limit: number = 100,
    _offset: number = 0
  ): Promise<ProjectDetails | null> {
    throw new Error(`Method not implemented. Project ID: ${projectId}`);
  }

  async getGlacierDetails(
    projectId: string,
    glacierId: string
  ): Promise<GlacierResponse | null> {
    throw new Error(
      `Method not implemented. Project ID: ${projectId}, Glacier ID: ${glacierId}`
    );
  }

  async getSceneDetails(
    projectId: string,
    sceneId: string
  ): Promise<{ scene: SceneDetails } | null> {
    throw new Error(
      `Method not implemented. Project ID: ${projectId}, Scene ID: ${sceneId}`
    );
  }

  async patchSceneStatus(
    sceneId: string,
    newStatus: string,
    _apiKey: string
  ): Promise<void> {
    throw new Error(
      `Method not implemented. Scene ID: ${sceneId}, New Status: ${newStatus}`
    );
  }
}

class APIDataSource extends DataSource {
  private axios: AxiosInstance;

  constructor(apiUrl: string) {
    super();
    this.axios = axios.create({ baseURL: apiUrl });
  }

  override async getProjects(): Promise<ProjectList> {
    try {
      const response = await this.axios.get<ProjectList>("/project");

      return response.data;
    } catch (error) {
      console.error("APIDataSource getProjects error:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  override async getProjectDetails(
    projectId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<ProjectDetails | null> {
    try {
      const response = await this.axios.get(
        `/project/${projectId}?limit=${limit}&offset=${offset}`
      );

      if ("scene_total_count" in response.data) {
        return response.data;
      } else {
        const totalCount =
          response.headers["X-Total-Count"] ||
          response.headers["x-total-count"];
        if (totalCount) {
          response.data.scene_total_count = parseInt(totalCount, 10);
        } else {
          response.data.scene_total_count = response.data.project.scenes.length;
        }
        return response.data;
      }
    } catch (error) {
      console.error("APIDataSource getProjectDetails error:", error);
      throw new Error(`Failed to fetch project details for ID: ${projectId}`);
    }
  }

  override async getGlacierDetails(
    projectId: string,
    glacierId: string
  ): Promise<GlacierResponse | null> {
    try {
      const glacierDetails = await this.axios.get(`/glacier/${glacierId}`);

      const glacierTimeSeries = await this.axios.get<{
        glacier_id: string;
        timeseries: GlacierTimeSeriesDataPoint[];
      }>(`/glacier/${glacierId}/timeseries`);

      const response: GlacierResponse = {
        glacier: glacierDetails.data,
        timeseries: glacierTimeSeries.data.timeseries,
      };
      return response;
    } catch (error) {
      console.error("APIDataSource getGlacierDetails error:", error);
      throw new Error(
        `Failed to fetch glacier details for Project ID: ${projectId}, Glacier ID: ${glacierId}`
      );
    }
  }

  override async getSceneDetails(
    projectId: string,
    sceneId: string
  ): Promise<{ scene: SceneDetails } | null> {
    try {
      const response = await this.axios.get(`/scene/${sceneId}`);

      console.log("APIDataSource getSceneDetails response:", response.data);

      return response.data;
    } catch (error) {
      console.error("APIDataSource getSceneDetails error:", error);
      throw new Error(
        `Failed to fetch scene details for Project ID: ${projectId}, Scene ID: ${sceneId}`
      );
    }
  }

  override async patchSceneStatus(
    sceneId: string,
    newStatus: string,
    apiKey: string
  ): Promise<void> {
    try {
      const response = await this.axios.patch(
        `/scene/${sceneId}/status/${newStatus}?api_key=${apiKey}`
      );

      console.log("APIDataSource patchSceneStatus response:", response.data);
      if (response.status !== 200) {
        throw new Error(
          `Failed to patch scene status for Scene ID: ${sceneId}, New Status: ${newStatus}`
        );
      }
    } catch (error) {
      console.error("APIDataSource patchSceneStatus error:", error);
      throw new Error(
        `Failed to patch scene status for Scene ID: ${sceneId}, New Status: ${newStatus}`
      );
    }
  }
}

class JSONDataSource extends DataSource {
  private baseUrl: string;

  constructor(baseUrl: string = "/server") {
    super();
    this.baseUrl = baseUrl;
  }

  override async getProjects(): Promise<ProjectList> {
    try {
      const response = await axios.get(`${this.baseUrl}/projects.json`);

      return response.data;
    } catch (error) {
      console.error("LocalDataSource getProjects error:", error);
      return {
        projects: [],
        map_bounds: [
          [0, 0],
          [0, 0],
        ],
      };
    }
  }

  override async getProjectDetails(
    projectId: string,
    _limit: number = 100,
    _offset: number = 0
  ): Promise<ProjectDetails | null> {
    try {
      const response = await axios.get<ProjectDetails>(
        `${this.baseUrl}/project/${projectId}.json`
      );

      return {
        ...response.data,
      };
    } catch (error) {
      console.error("LocalDataSource getProjectDetails error:", error);
      throw new Error(
        `Failed to fetch local project details for ID: ${projectId}`
      );
    }
  }

  override async getGlacierDetails(
    _projectId: string,
    glacierId: string
  ): Promise<GlacierResponse | null> {
    const response = await axios.get(
      `${this.baseUrl}/glacier/${glacierId}.json`
    );

    const {
      glacier,
      timeseries: { timeseries },
    } = response.data;

    const updatedTimeseries = timeseries.sort(
      (a: GlacierTimeSeriesDataPoint, b: GlacierTimeSeriesDataPoint) =>
        new Date(a.acquisition_date).getTime() -
        new Date(b.acquisition_date).getTime()
    );

    return {
      glacier,
      timeseries: updatedTimeseries,
    };
  }

  override async getSceneDetails(
    _projectId: string,
    sceneId: string
  ): Promise<null> {
    const response = await axios.get(`${this.baseUrl}/scene/${sceneId}.json`);
    return response.data;
  }
}

export { DataSource, APIDataSource, JSONDataSource };
