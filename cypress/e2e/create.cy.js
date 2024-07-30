describe("Add New User Functionality", () => {
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

    it("should navigate to new user page, create a user, and then cancel", () => {
        cy.intercept("POST", "/v1/auth/create", {
            statusCode: 200,
            body: {
                data: {
                    id: 1,
                },
            },
        }).as("createUserRequest");

        cy.intercept("GET", "/v1/auth/users", (req) => {
            req.reply({
                statusCode: 200,
                body: [],
            });
        }).as("getUsers");

        cy.visit("/dashboard/add-user");
        cy.log("Navigated to add user page.");

        cy.get('input[name="username"]').type("user");
        cy.get('input[name="password"]').type("password");
        cy.get('input[name="fullName"]').type("User 1");
        cy.get('input[name="phoneNumber"]').type("123456789");
        cy.get('[data-cy="userRole-select"]').click();
        cy.get('li[role="option"]').contains("Baker").click();

        cy.get('button[type="submit"]').click();
        cy.wait("@createUserRequest");

        cy.get("@createUserRequest").then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
            expect(interception.response.body.data.id).to.equal(1);
        });

        cy.log("User creation request completed.");

        cy.get('[data-cy="cancel-button"]').click();
        cy.url().should("include", "/dashboard/user-list");
        cy.log("Navigated to user list after clicking cancel.");
    });

    Cypress.on("uncaught:exception", (err, runnable) => {
        console.error("Uncaught Exception:", err);
        return false;
    });
});
