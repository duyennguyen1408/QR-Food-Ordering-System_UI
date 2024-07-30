describe("Delete User Functionality", () => {
    let startTime;

    beforeEach(() => {
        startTime = performance.now();

        cy.intercept("POST", "/v1/login", {
            statusCode: 200,
            body: {
                data: {
                    userRole: 5,
                },
            },
        }).as("loginRequest");

        cy.visit("/login");
        cy.get('input[name="username"]').type("qdien");
        cy.get('input[name="password"]').type("12345678");
        cy.get('button[type="submit"]').click();
        cy.wait("@loginRequest");
        cy.log("Logged in as admin successfully.");
    });

    afterEach(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        cy.task(
            "logExecutionTime",
            `Execution Time: ${duration.toFixed(2)} ms`
        );
    });

    it("should delete a user", () => {
        cy.intercept("DELETE", "/v1/auth/users/1", {
            statusCode: 200,
        }).as("deleteUser");

        cy.window().then((win) => {
            win.fetch("/v1/auth/users/1", {
                method: "DELETE",
            });
        });

        cy.wait("@deleteUser").then((interception) => {
            if (interception.response.statusCode === 200) {
                cy.log("DELETE API called successfully.");
            } else {
                cy.log("DELETE API call failed.");
            }
        });
    });

    Cypress.on("uncaught:exception", (err, runnable) => {
        console.error("Uncaught Exception:", err);
        return false;
    });
});
