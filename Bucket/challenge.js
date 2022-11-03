const { ButtonInteraction, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    id: 'challenge',
    name: 'challenge',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */

    async execute(interaction) {

        const SR = [
            'KAR98K',
            'M-24',
            'MOSIN',
            'AWM',
            'SKS',
            'SLR',
            'MK-14',
            'VSS',
            'MK-12',
            'MINI-14',
            'WIN-94',
            'Арбалет',
        ];

        const AR = [
            'MUTANT',
            'AKM',
            'GROZA',
            'ACE-32',
            'M16A4',
            'AUG',
            'SCAR-L',
            'M416',
            'DP-28',
            'MG3',
            'M249',
        ];
        
        function weapon(param) {
            const result = Math.floor(Math.random() * param);
            return result
        };

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Blurple)
                    .setDescription(
                        `Игрок 1: ${SR[weapon(SR.length)]} - ${AR[weapon(AR.length)]}\n`
                        + `Игрок 2: ${SR[weapon(SR.length)]} - ${AR[weapon(AR.length)]}\n`
                        + `Игрок 3: ${SR[weapon(SR.length)]} - ${AR[weapon(AR.length)]}\n`
                        + `Игрок 4: ${SR[weapon(SR.length)]} - ${AR[weapon(AR.length)]}\n`
                    )
            ], ephemeral: true
        });

    },
};