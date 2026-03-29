import { createServer } from "node:http";
import { createApplication } from "./app/index.js";

async function main() {
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
