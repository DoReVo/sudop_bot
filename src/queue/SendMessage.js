import axios from "axios";
import { server } from "../../server.js";

const sendMessage = async ({ subId, msg }) => {
  const { IO } = await import("./../../config/SqIo.js");

  server.log.info({ subscriberId: subId }, "Running sendMessage Job");

  const data = await axios.post(
    `${IO.IO_API_URL}/channel-subscribers/send`,
    {
      id: IO.IO_CAMPAIGN_ID,
      secret: IO.IO_CAMPAIGN_SECRET,
      message: msg,
      subscribers: [subId],
      type: "text",
    },
    {
      headers: {
        Authorization: IO.IO_ACCESS_TOKEN,
      },
    }
  );
  server.log.info({ subscriberId: subId }, "Finished sendMessage Job");
};

export { sendMessage };
