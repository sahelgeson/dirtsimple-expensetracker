describe('Check that the options can be edited on the options page', function () {
    before(() => {
        cy.visit('/options');
    });  

    describe('Check that user can enter a new category', function () {
        it('should open the add category accordion and enter in TEST as a new category', function () {
            cy.getQa('options-addcategory-accordion').click().then(() => {
                cy.getQa('options-add-category-input').type('TEST').then(() => {
                    cy.getQa('options-add-category-input').should('have.value', 'TEST');
                    cy.getQa('options-add-submit-btn').should('not.be.disabled');
                    cy.getQa('options-add-submit-btn').click().then(() =>{
                        // check localStorage to make sure it's added correctly
                        const state = JSON.parse(localStorage.getItem('state'));
                        const categories = state.categories;
                        let hasThisCategory = false
                        categories.forEach((category) => {
                            if (category.name === 'TEST') {
                                hasThisCategory = true;
                            }
                          });
                        expect(hasThisCategory).to.equal(true);
                    });
                });
            });
        });  

        it('should open the rename category accordion and rename TEST to ABCD', function () {
            cy.getQa('options-renamecategory-accordion').click().then(() => {
                cy.getQa('options-rename-category-old-input').select('TEST').then(() => {
                    cy.getQa('options-rename-category-new-input').type('ABCD').then(() => {                    
                        cy.getQa('options-rename-category-new-input').should('have.value', 'ABCD');
                        cy.getQa('options-rename-save-btn').should('not.be.disabled');
                        cy.getQa('options-rename-save-btn').click().then(() => {
                            // choose "Yes, Rename" on the modal
                            cy.getQa('options-rename-modal-yes-button').click().then(() => {                   
                                // check localStorage to make sure it's added correctly
                                const state = JSON.parse(localStorage.getItem('state'));
                                const categories = state.categories;
                                let hasNewCategory = false;
                                let hasOldCategory = false;
                                categories.forEach((category) => {
                                    if (category.name === 'ABCD') {
                                        hasNewCategory = true;
                                    }
                                    if (category.name === 'TEST') {
                                        hasOldCategory = true;
                                    }
                                });
                                expect(hasNewCategory).to.equal(true);
                                expect(hasOldCategory).to.equal(false);
                            });
                        });
                    });
                });
            });
        });  
  
        it('should open the view all categories accordion and check it contains the ABCD category', function () {
            cy.getQa('options-view-all-categories-accordion').click().then(() => {
                cy.getQa('options-view-all-categories-container').should('contain', 'ABCD');
            });
        });  

        it('should open the delete category accordion and delete the ABCD category', function () {
            cy.getQa('options-deletecategory-accordion').click().then(() => {
                cy.getQa('options-delete-category-input').select('ABCD').then(() => {
                    cy.getQa('options-delete-submit-btn').click().then(() =>{
                        // check localStorage to make sure it's added correctly
                        const state = JSON.parse(localStorage.getItem('state'));
                        const categories = state.categories;
                        let hasOldCategory = false;
                        categories.forEach((category) => {
                            if (category.name === 'ABCD') {
                                hasOldCategory = true;
                            }
                        });
                        expect(hasOldCategory).to.equal(false);
                    });
                });
            });
        }); 
    });
});
