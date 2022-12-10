const { SelectMenuInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    id: 'notify_roles',
    /**
     * 
     * @param {SelectMenuInteraction} interaction 
     */

    async execute(interaction) {

        const { values, member, component } = interaction;
        
        const removed = component.options.filter((option) => {
            return !values.includes(option.value)
        })


        for (const id of removed) {
            await member.roles.remove(id.value);
        };

        for (const id of values) {
            await member.roles.add(id)
        };
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setDescription(`**Ваши роли обновлены, спасибо что воспользовались**`)
            ],
            ephemeral: true
        })
    }
}