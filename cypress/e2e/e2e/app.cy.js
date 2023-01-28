describe('Check the easy path for the user entering in a new expense', function () {

    describe('Check that user can enter a new expense, then see that expense when going to All Expenses', function () {
        before(() => {
            cy.visit('/');
        });  

        it('should enter in an amount and save the new expense with default category Clothes', function () {
            cy.getQa('main-form-amount-input').type('8').then(() =>{
                cy.getQa('main-form-category-input').select('Clothes').then(() =>{
                    cy.getQa('main-form-save-btn').click().then(() => {
                        cy.getQa('main-form-see-all-btn').click().then(() => {
                            cy.url().should('contain', '/history');
                            cy.getQa('history-amount').first().should('contain', '$8')
                            cy.getQa('history-category').first().should('contain', 'Clothes')
                        });
                    });
                });
            });
        });          
    });
});
