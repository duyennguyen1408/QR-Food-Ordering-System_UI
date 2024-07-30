describe("Update User Functionality", () => {
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

    it("should update a user", () => {
        cy.intercept("GET", "/v1/auth/users/1", {
            statusCode: 200,
            body: {
                id: 1,
                fullName: "User 1",
                phoneNumber: "0987654321",
                userRole: 3,
            },
        }).as("getUserBeforeUpdate");

        cy.window().then((win) => {
            win.fetch("/v1/auth/users/1", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });

        cy.wait("@getUserBeforeUpdate").then((interception) => {
            if (interception.response.statusCode === 200) {
                cy.log("GET API called successfully before update.");
                cy.log(
                    "Fetched User Data Before Update:",
                    JSON.stringify(interception.response.body, null, 2)
                );
            } else {
                cy.log("GET API call failed before update.");
            }
        });

        cy.intercept("PUT", "/v1/auth/users/1", {
            statusCode: 200,
            body: {
                id: 1,
                fullName: "User Updated",
                phoneNumber: "1234567890",
                userRole: 4,
            },
        }).as("updateUser");

        cy.window().then((win) => {
            const userData = {
                id: 1,
                fullName: "User Updated",
                phoneNumber: "1234567890",
                userRole: 4,
            };
            win.fetch("/v1/auth/users/1", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
        });

        cy.wait("@updateUser").then((interception) => {
            if (interception.response.statusCode === 200) {
                cy.log("PUT API called successfully.");
                cy.log(
                    "Updated User Data:",
                    JSON.stringify(interception.response.body, null, 2)
                );
            } else {
                cy.log("PUT API call failed.");
            }
        });

        cy.intercept("GET", "/v1/auth/users/1", {
            statusCode: 200,
            body: {
                id: 1,
                fullName: "User Updated",
                phoneNumber: "1234567890",
                userRole: 4,
            },
        }).as("getUserAfterUpdate");

        cy.window().then((win) => {
            win.fetch("/v1/auth/users/1", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });

        cy.wait("@getUserAfterUpdate").then((interception) => {
            if (interception.response.statusCode === 200) {
                cy.log("GET API called successfully after update.");
                cy.log(
                    "Fetched Updated User Data:",
                    JSON.stringify(interception.response.body, null, 2)
                );
            } else {
                cy.log("GET API call failed after update.");
            }
        });
    });

    Cypress.on("uncaught:exception", (err, runnable) => {
        console.error("Uncaught Exception:", err);
        return false;
    });
});
