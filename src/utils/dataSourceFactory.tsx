import { APIDataSource, JSONDataSource, type DataSource } from "./dataSource";

let dataSourceInstance: DataSource | null = null;

const dataSourceType = import.meta.env.VITE_DATA_SOURCE;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const cloudfrontUrl = import.meta.env.VITE_CLOUDFRONT_API_BASE_URL;

export default function getDataSource(): DataSource {
  if (dataSourceInstance) {
    return dataSourceInstance;
  }

  switch (dataSourceType) {
    case "local":
      dataSourceInstance = new JSONDataSource();
      return dataSourceInstance;
    case "api":
      if (!apiBaseUrl) {
        throw new Error("VITE_API_BASE_URL is not defined");
      }
      dataSourceInstance = new APIDataSource(apiBaseUrl);
      return dataSourceInstance;
    case "cloudfront":
      if (!cloudfrontUrl) {
        throw new Error("VITE_CLOUDFRONT_API_BASE_URL is not defined");
      }
      dataSourceInstance = new JSONDataSource(cloudfrontUrl);
      return dataSourceInstance;
    default:
      throw new Error(`Unknown data source type: ${dataSourceType}`);
  }
}
