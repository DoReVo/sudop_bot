# About
A platform agnostic chat bot that you can use to track your todo list. The bot can accept and reply messages from platform such as ,Line, FB Messenger, Telegram, Slack, Wechat, Viber and many more.

# Features
- Add task
- Delete task
- List task

# Tech stacks
- NodeJs (Fastify)
- Redis
- Google Compute Engine (Ubuntu VPS)
- Google stack driver (Logging)
- SendQuick.Io (A SaaS that offered unified API for social & collaborative platforms)


# Deployment
1. Clone repo
2. Install dependencies `npm install`
3. Install redis on your server
4. Setup SendQuick.Io account
5. Setup Google stackdriver and get the credentials. See `example.stackdriver-creds.json`
6. Setup your environment variables (see `example.env`)
7. Refer `example.sudop.service` if you're using systemd as process manager
8. Install `pino-stackdriver` as global npm dependencies
9. Start server.js and pipe its stdout to pino-stackdriver for logging (see `example.sudop.service` for example of start command)

## Note
- Make sure to pipe `server.js` stdout to `pino-stackdriver` to send logs to google.