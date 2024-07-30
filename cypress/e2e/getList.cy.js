describe("Fetch and Log User List Functionality", () => {
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

    it("should fetch and log the user list", () => {
        cy.intercept("GET", "/v1/auth/users", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    fullName: "User 1",
                    phoneNumber: "123456789",
                    userRole: 4,
                },
                {
                    id: 2,
                    fullName: "User 2",
                    phoneNumber: "987654321",
                    userRole: 2,
                },
            ],
        }).as("getUsers");

        cy.visit("/dashboard/user-list");
        cy.wait("@getUsers").then((interception) => {
            if (interception.response.statusCode === 200) {
                cy.log("GET API called successfully.");
            } else {
                cy.log("GET API call failed.");
            }
        });

        cy.get("@getUsers").then((interception) => {
            cy.log("User data:", JSON.stringify(interception.response.body));
        });
    });

    Cypress.on("uncaught:exception", (err, runnable) => {
        console.error("Uncaught Exception:", err);
        return false;
    });
});
