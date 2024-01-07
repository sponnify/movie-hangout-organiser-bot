# Movie Watch Party Discord Bot

This is a Discord bot built with Node.js. It's designed to help manage a friend hangout Discord server for specifically movie watch parties at local theaters.

## Features

- **Server Setup**: When the bot is invited to a server and has the appropriate permissions, it automatically sets up the server with specific categories and channels.
- **Event Creation**: Users with a "planner" role can use the `/createevent` command to create a new movie event.
- **Event Updates**: The event planner can use the `/updateinfo` command to update the event details.
- **Event Cancellation**: The event planner can use the `/cancelevent` command to cancel the event.
- **Event Countdown**: The bot provides time-related warnings in the event channel as the movie showing time approaches.

## Commands

- `/createevent`: Create a new movie event. Options include the name of the film, the theater to watch it at, the date planned to watch, and the time planned.
- `/updateinfo`: Update the information of an existing event.
- `/cancelevent`: Cancel an existing event.
- `/help`: Get detailed information on how to use the bot.

## Discord Application Configuration

Visit https://discord.com/developers/applications to set one up. Remember to keep the generated Bot Token as you will need it later.

### Generate Invite URL

After you have created your application you will need to invite the Bot to a server. You can do this at your Discord Application screen:

- Click `OAuth2` in the menu
- Click `URL Generator`
- Check the `bot`, and `applications.commands` scope checkboxes.
- Check all the necessary permission checkboxes listed below.

### Required Bot Permissions

General Permissions: Administrator

### Invite Bot to Your Server

- Copy the generated URL
- Paste the URL into your browser
- Select your server
- Click continue
- Click authorize
- All done!

## Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies. If you haven't already, you'll need to install Node.js and npm (which comes with Node.js). You can download them from the official Node.js website.
3. Copy the `.env.example` file to a new file named `.env` in the root directory.
4. In the `.env` file, replace `bot-token` with your actual bot token and `client-id` with your actual client ID.
5. Run `node index.js` to start the bot.

Or if you're using a terminal:

```bash
git clone [repository-url]
cd [project-directory-name]
npm install
cp .env.example .env
nano .env
node index.js

## Known Issues

- Please refer to the [Issues](https://github.com/your-repo/your-bot/issues) section of the repository for known issues and ongoing work.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[GPL](https://choosealicense.com/licenses/gpl-3.0/)