describe('Login Page Visibility Check', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    // Mock the API response for /api/auth/session with success and no data
    cy.intercept('GET', '/api/auth/session', {
      statusCode: 200,
      body: null,
    }).as('mockSessionSuccess');
  });

  it('should load the login page correctly', () => {
    cy.visit('http://localhost:5000/login')

    cy.wait(5000);

    cy.get('h2').should('contain', 'Login to your account');
    cy.get('input[id="login_email"]').should('be.visible');
    cy.get('input[id="login_password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible')
  })
})
