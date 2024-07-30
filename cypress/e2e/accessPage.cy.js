describe("TableDetail Functionality", () => {
    let startTime;

    beforeEach(() => {
        startTime = performance.now();
        cy.visit("/tables/6");
    });

    afterEach(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        cy.log(`Execution Time: ${duration.toFixed(2)} ms`);
    });

    it("should navigate to menu page", () => {
        cy.get('img[alt="QR Code"]').click();
    });
});
