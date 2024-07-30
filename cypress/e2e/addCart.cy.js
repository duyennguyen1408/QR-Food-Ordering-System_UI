describe("Add to Cart functionality", () => {
    let startTime;

    beforeEach(() => {
        startTime = performance.now();
        cy.visit("/coffee-shops/3/tables/6?table-name=hehe&zone=A&capacity=12");
    });

    afterEach(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        cy.log(`Execution Time: ${duration.toFixed(2)} ms`);
    });

    it("should add a dish to the cart and verify it appears in the cart page", () => {
        cy.get('[data-testid="loading-content"]').should("not.exist");
        cy.get('[data-testid^="add-to-cart-"]').first().click();

        cy.get('[data-testid="cart-icon"]').should("exist");
        cy.get('[data-testid="cart-badge"]').should("contain.text", "1");
    });
});
