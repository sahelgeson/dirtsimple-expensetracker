describe('Check the easy path for the user entering in a new expense for the main form', function () {

    describe('Check that user can enter a new expense which is saved and displayed in Recent Expenses', function () {
        before(() => {
            cy.visit('/');
        });  

        it('should enter in an amount and save the new expense with default category Food', function () {
            cy.getQa('main-form-amount-input').type('6').then(() =>{
                cy.getQa('main-form-category-input').should('have.value', 'Food')
                cy.getQa('main-form-save-btn').click().then(() =>{
                    // check localStorage to make sure it's added correctly

                    // TODO: need to change this, no longer arranged by index
                    const newExpense = JSON.parse(localStorage.getItem('myExpensesWithIds'))[0];
                    expect(newExpense.amount).to.equal('6');
                    expect(newExpense.category).to.equal('Food');
                });
            });
        });  

        it('should enter in an amount, change the category, and save the new expense', function () {
            cy.getQa('main-form-amount-input').type('7').then(() =>{
                cy.getQa('main-form-category-input').select('Other').then(() =>{
                    cy.getQa('main-form-save-btn').click().then(() =>{
                        // check localStorage to make sure it's added correctly

                        // TODO: need to change this, no longer arranged by index
                        const newExpense = JSON.parse(localStorage.getItem('myExpensesWithIds'))[0];
                        expect(newExpense.amount).to.equal('7');
                        expect(newExpense.category).to.equal('Other');
                    });
                });
            });
        });  

        it('should enter in an amount and save a new expense which shows up at the top of Recent Expenses', function () {
            cy.getQa('main-form-amount-input').type('8').then(() =>{
                cy.getQa('main-form-category-input').select('Clothes').then(() =>{
                    cy.getQa('main-form-save-btn').click().then(() =>{
                        // get the first item in recent expenses
                        cy.getQa('recent-expenses').get('.tr').eq(0).get('.td').eq(0).should('contain', '$8')
                        cy.getQa('recent-expenses').get('.tr').eq(0).get('.td').eq(1).should('contain', 'Clothes')
                    });
                });
            });
        });          
    });
});
