import { CONSTANT } from "../../config/Constant.js";
import { sendMessageQueue, server } from "../../server.js";

const ProcessMessage = async ({ subId, msg }) => {
  const { log } = server;
  const BASE_REGEX = /(?<command>\/\S+)([^\S\r\n]+)?(?<value>.+)?/;

  const matches = msg.match(BASE_REGEX);

  if (!matches) {
    await sendMessageQueue.push({
      subId,
      msg: `Sorry I could not understand your command :(\n\nUse /help to see available commands`,
    });
    return;
  }

  const subTaskSet = `sudop:sub:tasks:${subId}`;

  switch (matches.groups.command) {
    case "/help": {
      log.info("/help command issued");
      await sendMessageQueue.push({ subId, msg: CONSTANT.WELCOME_MESSAGE });
      break;
    }

    case "/addtask": {
      log.info({ subId }, "/addtask command issued");

      const task = matches.groups.value;

      if (!task) {
        await sendMessageQueue.push({
          subId,
          msg: "Sorry, your task is invalid",
        });
        return;
      }

      await server.redis.sadd(subTaskSet, task);
      log.info({ subId, task }, "/addtask task saved");

      await sendMessageQueue.push({
        subId,
        msg: `Task (${task}) added`,
      });
      break;
    }
    case "/deletetask": {
      log.info({ subId }, "/deletetask command issued");

      const task = matches.groups.value;

      if (!task) {
        await sendMessageQueue.push({
          subId,
          msg: "Sorry, your task is invalid",
        });
        return;
      }

      const isSuccess = await server.redis.srem(subTaskSet, task);

      if (isSuccess === 1) {
        log.info({ subId, task }, "/deletetask task deleted");
        await sendMessageQueue.push({
          subId,
          msg: `Task (${task}) deleted`,
        });
      } else {
        log.info({ subId, task }, "/deletetask task not found");
        await sendMessageQueue.push({
          subId,
          msg: "Sorry, task not found, please check your spelling, tasks are case sensitive",
        });
      }
      break;
    }

    case "/listtask": {
      log.info({ subId }, "/listtask command issued");

      const tasks = await server.redis.smembers(subTaskSet);

      if (tasks.length === 0) {
        log.info({ subId }, "/listtask no task found");

        await sendMessageQueue.push({
          subId,
          msg: "You currently don't have any task",
        });
        return;
      }

      let msg = "Your current tasks:\n";
      for (const task of tasks) {
        msg = `${msg}
- ${task}`;
      }
      await sendMessageQueue.push({
        subId,
        msg,
      });

      break;
    }

    default: {
      await sendMessageQueue.push({
        subId,
        msg: `Sorry I could not understand your command :(\n\nUse /help to see available commands`,
      });
      break;
    }
  }
};

export { ProcessMessage };
