import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on("task", {
                logExecutionTime(message) {
                    return null;
                },
            });
        },
        baseUrl: "http://localhost:5173",
        specPattern: "cypress/e2e/*.cy.js",
    },
});
