const CronJob = require('cron').CronJob;
const { Premium } = require('../../schemas/premium');
const { GUILD_ID } = require('../../config.json');

module.exports = (client) => {
    client.premium = async () => {

        const premiumDays = new CronJob("*/1 * * * *", async function () {
            const premiumSubscribers = await Premium.find({});

            if (premiumSubscribers.length == 0) return;

            premiumSubscribers.map((member) => {
                const oneMonth = 2678400000;
                //TODO
            })
        });

        premiumDays.start()
    };
};