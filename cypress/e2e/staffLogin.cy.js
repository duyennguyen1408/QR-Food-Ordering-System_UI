describe("Staff Login Functionality", () => {
    beforeEach(() => {
        cy.visit("/login");
    });

    it("should display login form elements", function () {
        const startTime = new Date().getTime();
        cy.get("h2").should("contain.text", "Login");
        cy.get('input[name="username"]').should("exist");
        cy.get('input[name="password"]').should("exist");
        cy.get('button[type="submit"]').should("contain.text", "SIGN IN");
        const endTime = new Date().getTime();
        cy.log(
            `Execution time for "should display login form elements": ${
                endTime - startTime
            } ms`
        );
    });

    it("should log in and redirect to kitchen for staff", function () {
        const startTime = new Date().getTime();
        cy.intercept("POST", "/v1/login", {
            statusCode: 200,
            body: {
                data: {
                    userRole: 3,
                },
            },
        }).as("loginRequest");

        cy.get('input[name="username"]').type("staff");
        cy.get('input[name="password"]').type("12345678");
        cy.get('button[type="submit"]').click();

        cy.wait("@loginRequest");
        cy.url().should("include", "/kitchen");
        const endTime = new Date().getTime();
        cy.log(
            `Execution time for "should log in and redirect to kitchen for staff": ${
                endTime - startTime
            } ms`
        );
    });

    it("should display error message for incorrect credentials", function () {
        const startTime = new Date().getTime();
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
        const endTime = new Date().getTime();
        cy.log(
            `Execution time for "should display error message for incorrect credentials": ${
                endTime - startTime
            } ms`
        );
    });
});
