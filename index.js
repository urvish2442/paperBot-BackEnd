// index.js
require("dotenv").config();
const app = require("./src/app");
const { connectDb } = require("./src/config/connection");
async function main() {
    await connectDb();
    app.listen(process.env.PORT, () => {
        console.log(`server is running on ${process.env.PORT}`);
    });
}
main();
