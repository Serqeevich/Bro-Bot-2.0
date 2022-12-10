const mongoose = require('mongoose');

module.exports = (client) => {
    client.connect = async () => {
        const mongo = process.env.mongo;

        if (!mongo) {
            console.log(`❌ mongo url is no added to env file.`);
            process.exit()
        };

        await mongoose.connect(mongo, {
            keepAlive: true,
            useNewUrlParser: true,
        }).then(() => {
            console.log(`Connected to mongo DB`);
        }).catch((err) => {
            console.log(err)
        });
    }
};