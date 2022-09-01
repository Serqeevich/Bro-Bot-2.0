// const { SelectMenuInteraction, EmbedBuilder, Colors } = require('discord.js')

// module.exports = {
//     id: 'other_games_roles',
//     /**
//      * 
//      * @param {SelectMenuInteraction} interaction 
//      */

//     async execute(interaction) {

//         await interaction.deferReply({ ephemeral: true })
//         const { values, member, component } = interaction;
//         try {
//             const removed = component.options.filter((option) => {
//                 return !values.includes(option.value)
//             })

//             for (const id of removed) {
//                 console.log(`delete`, id.label)
//                 await member.roles.remove(id.value);
//             };

//             for (const id of values) {
//                 console.log(`add`, id.label)
//                 await member.roles.add(id)
//             };
//             interaction.editReply({
//                 embeds: [
//                     new EmbedBuilder()
//                         .setColor(Colors.Green)
//                         .setDescription(`**Ваши роли обновлены!**`)
//                 ],
//             })
//         } catch {
//             interaction.editReply({
//                 content:
//                     `**Произошла ошибка!**\n\n`
//                     + `Скорее всего одна из ролей была удаленна...\n`
//                     + `Пожалуйста сообщите об этом <@${interaction.guild.ownerId}>.`,
//             })
//         }
//     }
// }