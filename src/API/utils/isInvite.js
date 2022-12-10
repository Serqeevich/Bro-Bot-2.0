const isInvite = async (guild, code) => {

    return await new Promise((resolve) => {

        guild.invites.fetch().then((invites) => {

            for (const invite of invites) {

                if (code === invite[0]) {

                    resolve(true)

                    return
                };
            };

            resolve(false);
        });
    });
};

module.exports.isInvite = isInvite;