const { EmbedBuilder } = require("discord.js");

function createEmbed(action, moderator, target, reason) {
    return new EmbedBuilder()
        .setColor("#ff2d55")
        .setTitle(`🔨 ${action}`)
        .setDescription(`**${target.tag}** has received a moderation action.`)
        .addFields(
            { name: "Moderator", value: moderator.tag, inline: true },
            { name: "Target", value: target.tag, inline: true },
            { name: "Reason", value: reason || "No reason provided", inline: false }
        )
        .setThumbnail(target.displayAvatarURL())
        .setTimestamp();
}

module.exports = { createEmbed };
