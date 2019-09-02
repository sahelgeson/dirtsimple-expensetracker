describe('Check the easy path for the user entering in a new expense', function () {

    describe('Check that user can enter an amount', function () {
        before(() => {
            cy.visit('/');
        });  

        it('should enter in an amount and save the new expense with default category Food', function () {
            cy.getQa('main-form-amount-input').type('6');
            cy.getQa('main-form-category-input').should('have.value', 'Food')
            cy.getQa('main-form-save-btn').click().then(() =>{
                // check localStorage to make sure it's added correctly
                const newExpense = JSON.parse(localStorage.getItem('myExpenses'))[0];
                expect(newExpense.amount).to.equal('6');
                expect(newExpense.category).to.equal('Food');
            });
        });  

        it('should enter in an amount, change the category, and save the new expense', function () {
            cy.getQa('main-form-amount-input').type('7');
            cy.getQa('main-form-category-input').select('Other');
            cy.getQa('main-form-save-btn').click().then(() =>{
                // check localStorage to make sure it's added correctly
                const newExpense = JSON.parse(localStorage.getItem('myExpenses'))[0];
                expect(newExpense.amount).to.equal('7');
                expect(newExpense.category).to.equal('Other');
            });
        });  
    });
});
