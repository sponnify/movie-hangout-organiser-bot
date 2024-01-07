# My Discord Bot

This is a Discord bot built with Node.js. It includes several features to interact with Discord API.

## Project Structure

/my-discord-bot
├── node-modules
├── src
│   ├── bot.js
│   ├── commands
│   │   ├── createEvent.js
│   │   ├── updateInfo.js
│   │   ├── cancelEvent.js
│   │   └── help.js
│   ├── events
│   │   ├── guildCreate.js
│   │   ├── messageReactionAdd.js
│   │   ├── interactionCreate.js
│   │   └── ready.js
│   ├── utils
│   │   ├── embeds.js
│   │   ├── channelUtils.js
│   │   ├── errors.js
│   │   ├── validation.js
│   │   ├── permissions.js
│   │   ├── time.js
│   └── data
│       ├── db.js
│       ├── models.js
├── index.js
├── .env
├── .gitignore
├── package.json
└── README.md


## Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file in the root directory and add your bot token like so: `DISCORD_BOT_TOKEN=your-bot-token`.
4. Run `node index.js` to start the bot.

## Features

- Event creation: `createEvent.js`
- Update information: `updateInfo.js`
- Cancel event: `cancelEvent.js`
- Help: `help.js`
- Event handlers: `guildCreate.js`, `messageReactionAdd.js`, `interactionCreate.js`, `ready.js`
- Utility functions: `embeds.js`, `channelUtils.js`, `errors.js`, `validation.js`, `permissions.js`, `time.js`
- Database functions: `db.js`, `models.js`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[GPL](https://choosealicense.com/licenses/gpl-3.0/)