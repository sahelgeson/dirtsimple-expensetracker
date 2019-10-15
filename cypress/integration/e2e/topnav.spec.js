describe('Check that the top nav item is properly highlighted depending on the page', function () {

    describe('Check that when the user navigates to the All Expenses page that All Expenses has a bottom border', function () {
        before(() => {
            cy.visit('/');
        });  

        it('should click on the All Expenses nav selection and then check that All Expenses has a bottom border and no other', function () {
            cy.getQa('app-history-link').should('have.css', 'border-bottom-width').and('match', /0/);
            cy.getQa('app-history-link').click().then(() => {
                cy.getQa('app-home-link').should('have.css', 'border-bottom-width').and('match', /0/);
                cy.getQa('app-history-link').should('have.css', 'border-bottom-width').and('match', /2/);
                cy.getQa('app-options-link').should('have.css', 'border-bottom-width').and('match', /0/);
            });
        });   
        it('should click on the Options nav selection and then check that Options has a bottom border and no other', function () {
            cy.getQa('app-options-link').should('have.css', 'border-bottom-width').and('match', /0/);
            cy.getQa('app-options-link').click().then(() => {
                cy.getQa('app-home-link').should('have.css', 'border-bottom-width').and('match', /0/);
                cy.getQa('app-history-link').should('have.css', 'border-bottom-width').and('match', /0/);
                cy.getQa('app-options-link').should('have.css', 'border-bottom-width').and('match', /2/);
            });
        });     
        it('should click on Home while on the Options page and then check that Home has a bottom border and no other', function () {
            cy.getQa('app-options-link').click().then(() => {
                cy.getQa('app-home-link').should('have.css', 'border-bottom-width').and('match', /0/);
                cy.getQa('app-home-link').click().then(() => {
                    cy.getQa('app-home-link').should('have.css', 'border-bottom-width').and('match', /2/);
                    cy.getQa('app-history-link').should('have.css', 'border-bottom-width').and('match', /0/);
                    cy.getQa('app-options-link').should('have.css', 'border-bottom-width').and('match', /0/);
                });
            });
        });       
    });
});
