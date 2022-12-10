const { GuildMember } = require('discord.js');
const { Members } = require('../../schemas/members');
const { User } = require('../../schemas/pubg-player');
const { Streamers } = require('../../schemas/streamers');
const { Rooms } = require('../../schemas/private-room');

module.exports = {
    name: 'guildMemberRemove',
    /**
     * 
     * @param {GuildMember} member 
     */

    async execute(member) {

        await Members.findOneAndDelete({ userId: member.id });
        await User.findOneAndDelete({ discordId: member.id });
        await Streamers.findOneAndDelete({ userId: member.id });

        const room = await Rooms.findOne({ userId: member.id })

        if (room) {
            const channel = member.guild.channels.cache.get(room.channelId);
            channel.delete();
            room.delete()
        }
    }
}
