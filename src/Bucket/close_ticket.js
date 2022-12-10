const { ButtonInteraction } = require("discord.js");
const { Ticket } = require("../schemas/ticket");

module.exports = {
  id: "close_ticket",
  name: "закрыть билет",
  /**
   *
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    const { member, guild } = interaction;

    const ticket = await Ticket.findOne({ userId: member.id });

    const channel = guild.channels.cache.get(ticket.channelId);

    await channel.delete();
    await ticket.delete();

    interaction.reply({ content: ``, ephemeral: true });
  },
};
