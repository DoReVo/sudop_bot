import fastify from "fastify";
import fastifyEnv from "fastify-env";
import fastifyRedis from "fastify-redis";
import fastq from "fastq";
import { CONSTANT } from "./config/Constant.js";

import envConfig from "./config/env.js";
import { ProcessMessage } from "./src/queue/ProcessMessage.js";
import { sendMessage } from "./src/queue/SendMessage.js";

const server = await fastify({
  logger: {
    prettyPrint: false,
  },
  disableRequestLogging: true,
});

await server.register(fastifyEnv, {
  dotenv: true,
  schema: envConfig,
  confKey: "envConfig",
});

await server.register(fastifyRedis, { host: server.envConfig.REDIS_HOST });

const sendMessageQueue = fastq.promise(sendMessage, 1);
const processMessageQueue = fastq.promise(ProcessMessage, 1);

// Declare a route
server.get("/", async (request, reply) => {
  return { version: "1.0.0" };
});

server.post("/io-webhook", async ({ body, log }, reply) => {
  const {
    data: { event },
  } = body;

  const { redis } = server;

  switch (event.type) {
    case "verify-webhook":
      log.info({ event }, "Received verify-webhook challenge");
      return event.challenge;
      break;
    case "opt-in":
    case "message":
    case "command":
      log.info({ event }, "New message");
      const { from } = event;

      const subSet = "sudop:sub:set";
      const subRedisKey = `sudop:sub:${from.subscriberId}`;

      const isExistingSub = await redis.sismember(subSet, subRedisKey);

      // If new user
      if (isExistingSub === 0) {
        // If existing user
        log.info({ subscriberId: from.subscriberId }, "New subscriber");
        // Add user to user set
        await redis.sadd(subSet, subRedisKey);
        log.info({ subscriberId: from.subscriberId }, "Subscriber saved");

        await sendMessageQueue.push({
          subId: from.subscriberId,
          msg: "Hi I am sudop! use /help to see a list of commands",
        });

        // send welcome message
        await sendMessageQueue.push({
          subId: from.subscriberId,
          msg: CONSTANT.WELCOME_MESSAGE,
        });

        return "Ok";
      }
      log.info({ subscriberId: from.subscriberId }, "Existing subscriber");

      for (const msg of event.messages) {
        await processMessageQueue.push({
          subId: from.subscriberId,
          msg: msg.message,
        });
      }

      return "Ok";
      break;

    case "message-status":
    default:
      return "Ok";
      break;
  }
});

// Run the server!
const start = async () => {
  try {
    const PORT = server.envConfig.PORT;
    await server.listen(PORT, "0.0.0.0");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

export { server, sendMessageQueue };
