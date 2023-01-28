describe('Check the easy path for the user entering in a new expense for the main form', function () {

    describe('Check that user can enter a new expense which is saved and displayed in Recent Expenses', function () {
        before(() => {
            cy.visit('/');
        });  

        it('should enter in an amount, change the category, and save the new expense', function () {
            cy.getQa('main-form-amount-input').type('7').then(() =>{
                cy.getQa('main-form-category-input').select('Other').then(() =>{
                    cy.getQa('main-form-save-btn').click().then(() =>{                        
                        cy.getQa('recent-expenses').get('.tr').eq(0).get('.td').eq(0).should('contain', '$7');
                        cy.getQa('recent-expenses').get('.tr').eq(0).get('.td').eq(1).should('contain', 'Other');
                    });
                });
            });
        });         
    });
});
