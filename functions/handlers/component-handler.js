const fs = require('fs');

module.exports = async (client) => {
    client.handleComponents = () => {
        const componentFolders = fs.readdirSync('./Components');
        for (const folder of componentFolders) {
            const componentFiles = fs
                .readdirSync(`./Components/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const { buttons, modals, selectMenus } = client;

            switch (folder) {
                case 'buttons': {
                    for (const file of componentFiles) {
                        const button = require(`../../Components/${folder}/${file}`);
                        if (!button.id) return;
                        buttons.set(button.id, button)
                    };
                }; break;

                case 'modals': {
                    for (const file of componentFiles) {
                        const modal = require(`../../Components/${folder}/${file}`);
                        if (!modal.id) return;
                        modals.set(modal.id, modal)
                    };
                }; break;

                case 'select menus': {
                    for(const file of componentFiles){
                        const selectMenu = require(`../../Components/${folder}/${file}`);
                        if(!selectMenu.id) return;
                        selectMenus.set(selectMenu.id, selectMenu)
                    };
                }; break;

            }
        };
    };
};