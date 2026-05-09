require("dotenv").config();

module.exports = {
    token: process.env.BOT_TOKEN,
    guildId: process.env.GUILD_ID,
    logChannel: process.env.PUBLIC_LOG_CHANNEL_ID
};
