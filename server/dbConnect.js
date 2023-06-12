const mongoose = require("mongoose");

module.exports = async () => {
    const { PASS } = process.env;

    const mongoUri = `mongodb+srv://singhjatin354:${PASS}@cluster0.ch7xaym.mongodb.net/?retryWrites=true&w=majority`;

    try {
        const connect = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`DB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
