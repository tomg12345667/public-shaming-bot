const {
    Client,
    GatewayIntentBits,
    AuditLogEvent
} = require("discord.js");

const config = require("./config");
const db = require("./database");
const { createEmbed } = require("./embeds");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration
    ]
});

client.once("ready", () => {
    console.log(`${client.user.tag} online.`);
});

async function sendLog(type, guild) {
    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type
    });

    const log = fetchedLogs.entries.first();

    if (!log) return;

    const { executor, target, reason } = log;

    const channel = guild.channels.cache.get(config.logChannel);

    if (!channel) return;

    const embed = createEmbed(
        type.replaceAll("_", " "),
        executor,
        target,
        reason
    );

    const msg = await channel.send({
        embeds: [embed]
    });

    db.prepare(`
        INSERT INTO logs
        (action, moderator, target, reason, message_id)
        VALUES (?, ?, ?, ?, ?)
    `).run(
        type,
        executor.tag,
        target.tag,
        reason || "None",
        msg.id
    );
}

client.on("guildBanAdd", async (ban) => {
    await sendLog(AuditLogEvent.MemberBanAdd, ban.guild);
});

client.on("guildMemberRemove", async (member) => {
    const logs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberKick
    });

    const kickLog = logs.entries.first();

    if (!kickLog) return;

    if (kickLog.target.id === member.id) {
        await sendLog(AuditLogEvent.MemberKick, member.guild);
    }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (
        oldMember.communicationDisabledUntilTimestamp !==
        newMember.communicationDisabledUntilTimestamp
    ) {
        await sendLog(
            AuditLogEvent.MemberUpdate,
            newMember.guild
        );
    }
});

client.login(config.token);
