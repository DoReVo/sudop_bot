import { server } from "../server.js";

const IO = {
  IO_API_URL: server.envConfig.IO_API_URL,
  IO_CAMPAIGN_ID: server.envConfig.IO_CAMPAIGN_ID,
  IO_CAMPAIGN_SECRET: server.envConfig.IO_CAMPAIGN_SECRET,
  IO_ACCESS_TOKEN: server.envConfig.IO_ACCESS_TOKEN,
};

export { IO };
