const {
  ModalSubmitInteraction,
  ChannelType,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { SUPPORT_CATEGORY_ID } = require("../../config.json");
const { Ticket } = require("../../Bucket/ticket");

module.exports = {
  id: "create_ticket_modal",
  /**
   *
   * @param {ModalSubmitInteraction} interaction
   */

  async execute(interaction) {
    const { guild, fields, member } = interaction;

    const id = fields.getTextInputValue(`report_modal_id`);
    const message = fields.getTextInputValue(`report_modal_text`);

    await interaction.deferReply({ ephemeral: true });

    const targetMember = guild.members.cache.get(id);

    if (!targetMember) {
      return interaction.editReply({
        content: `Участник с таким id не найден.`,
      });
    }

    const channel = await guild.channels.create({
      name: `🔖︰${member.user.username} ticket`,
      type: ChannelType.GuildText,
      parent: SUPPORT_CATEGORY_ID,
    });

    await channel.send({
      content: `<@${member.id}>`,
      allowedMentions: { users: [member.id] },
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Green)
          .setThumbnail(targetMember.displayAvatarURL({ forceStatic: true }))
          .setDescription(
            `**Жалоба на участника**  ${targetMember}\n\n` +
              `${message}\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━`
          )
          .setFooter({ text: `ID билета - ${member.id}` })
          .setTimestamp(),
      ],
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId(`close_ticket`)
            .setStyle(ButtonStyle.Danger)
            .setLabel(`Закрыть билет`)
        ),
      ],
    });

    await Ticket({
      userId: member.id,
      channelId: channel.id,
    }).save();

    interaction.editReply({
      content: `**Ваш билет создан. В ближайшее время вам ответит модератор.**`,
    });
  },
};
