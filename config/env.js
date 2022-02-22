export default {
  type: "object",
  required: [
    "NODE_ENV",
    "PORT",
    "REDIS_HOST",
    "IO_CAMPAIGN_ID",
    "IO_CAMPAIGN_SECRET",
    "IO_ACCESS_TOKEN",
    "IO_API_URL",
  ],
  properties: {
    NODE_ENV: {
      type: "string",
      default: "development",
    },
    PORT: {
      type: "number",
      default: 3500,
    },
    REDIS_HOST: {
      type: "string",
      default: "localhost",
    },
    IO_CAMPAIGN_ID: {
      type: "string",
    },
    IO_CAMPAIGN_SECRET: {
      type: "string",
    },
    IO_ACCESS_TOKEN: {
      type: "string",
    },
    IO_API_URL: {
      type: "string",
    },
  },
};
