describe('Home Page Visibility Check', () => {
  // beforeEach(() => {
  //   Cypress.on('uncaught:exception', (err, runnable) => {
  //     return false;
  //   });

  //   // Mock the API response for /api/auth/session with success and no data
  //   cy.intercept('GET', '/api/auth/session', {
  //     statusCode: 200,
  //     body: null,
  //   }).as('mockSessionSuccess');
  // });

  // it('should load the Home page correctly', () => {
  //   // Visit the Home page
  //   cy.visit('http://localhost:5000');

  //   cy.wait(5000);

  //   // Check for expected content on the page
  //   cy.contains("Australia’s #1 Resource for Selective School and Scholarship Tests").should('be.visible');
  // });
});
