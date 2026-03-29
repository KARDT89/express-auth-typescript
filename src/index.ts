import { createServer } from "node:http";
import { createApplication } from "./app/index.js";
import "dotenv/config";

async function main() {
    console.log("DB:", process.env.DATABASE_URL);
    try {
        const server = createServer(createApplication());
        const PORT: number = 8080;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

main();
