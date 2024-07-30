describe("Admin/Manager Login Functionality", () => {
    let startTime;

    beforeEach(() => {
        startTime = performance.now();
        cy.visit("/login");
    });

    afterEach(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        cy.task(
            "logExecutionTime",
            `Execution Time: ${duration.toFixed(2)} ms`
        );
    });

    it("should display login form elements", () => {
        cy.get("h2").should("contain.text", "Login");
        cy.get('input[name="username"]').should("exist");
        cy.get('input[name="password"]').should("exist");
        cy.get('button[type="submit"]').should("contain.text", "SIGN IN");
    });

    it("should log in and redirect to dashboard for admin/manager", () => {
        cy.intercept("POST", "/v1/login", {
            statusCode: 200,
            body: {
                data: {
                    userRole: 5,
                },
            },
        }).as("loginRequest");

        cy.get('input[name="username"]').type("qdien");
        cy.get('input[name="password"]').type("12345678");
        cy.get('button[type="submit"]').click();

        cy.wait("@loginRequest");
        cy.url().should("include", "/dashboard");
    });

    it("should display error message for incorrect credentials", () => {
        cy.intercept("POST", "/v1/login", {
            statusCode: 401,
            body: {
                error: "Invalid username or password.",
            },
        }).as("loginRequest");

        cy.get('input[name="username"]').type("wronguser");
        cy.get('input[name="password"]').type("wrongpassword");
        cy.get('button[type="submit"]').click();

        cy.wait("@loginRequest");
        cy.get(".error-text").should(
            "contain.text",
            "Invalid username or password."
        );
    });
});
