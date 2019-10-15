describe('Check that the options can be edited on the options page', function () {
    before(() => {
        cy.visit('/options');
    });  

    describe('Check that user can enter a new category', function () {
        it('should open the add category accordion and enter in TEST as a new category', function () {
            cy.getQa('options-add-category-accordion').click().then(() => {
                cy.getQa('options-add-category-input').type('TEST').then(() => {
                    cy.getQa('options-add-category-input').should('have.value', 'TEST');
                    cy.getQa('options-add-submit-btn').should('not.be.disabled');
                    cy.getQa('options-add-submit-btn').click().then(() =>{
                        // check localStorage to make sure it's added correctly
                        const categories = JSON.parse(localStorage.getItem('myCategories'));
                        const newCategory = categories[(categories.length - 1)];
                        expect(newCategory).to.equal('TEST');
                    });
                });
            });
        });  

        it('should open the rename category accordion and rename TEST to ABCD', function () {
            cy.getQa('options-rename-category-accordion').click().then(() => {
                cy.getQa('options-rename-category-old-input').select('TEST').then(() => {
                    cy.getQa('options-rename-category-new-input').type('ABCD').then(() => {                    
                        cy.getQa('options-rename-category-new-input').should('have.value', 'ABCD');
                        cy.getQa('options-rename-submit-btn').should('not.be.disabled');
                        cy.getQa('options-rename-submit-btn').click().then(() =>{
                            // check localStorage to make sure it's renamed correctly
                            const categories = JSON.parse(localStorage.getItem('myCategories'));
                            const newCategory = categories[(categories.length - 1)];
                            expect(newCategory).to.equal('ABCD');
                        });
                    });
                });
            });
        });  
  
        it('should open the view all categories accordion and check it contains the ABCD category', function () {
            cy.getQa('options-view-all-category-accordion').click().then(() => {
                cy.getQa('options-view-all-category-container').should('contain', 'ABCD');
            });
        });  

        it('should open the delete category accordion and delete the ABCD category', function () {
            cy.getQa('options-delete-category-accordion').click().then(() => {
                cy.getQa('options-delete-category-input').select('ABCD').then(() => {
                    cy.getQa('options-delete-submit-btn').click().then(() =>{
                        // check localStorage to make sure it's deleted correctly
                        const categories = JSON.parse(localStorage.getItem('myCategories'));
                        const wasCategoryDeleted = categories.indexOf('ABCD') === -1;
                        expect(wasCategoryDeleted).to.equal(true);
                    });
                });
            });
        }); 
    });
});
