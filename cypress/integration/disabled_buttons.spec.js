import { testExpenses } from '../utils/constants';

describe('Check that save buttons are disabled when amount is zero, empty, or NaN', function () {

    describe('Check the save button on the homepage', function () {
        before(() => {
            cy.visit('/');
        });  

        it('should check the button is disabled onload because initial value is empty', function () {
            cy.getQa('main-form-save-btn').should('be.disabled');
        });  

        it('should check the button is disabled if user focuses on input', function () {
            cy.getQa('main-form-amount-input').click();
            cy.getQa('main-form-save-btn').should('be.disabled');
        });  

        it('should check the button is disabled if user enters 0', function () {
            cy.getQa('main-form-amount-input').type('0');
            cy.getQa('main-form-save-btn').should('be.disabled');
        });  

        it('should check the button is disabled if user enters NaN', function () {
            cy.getQa('main-form-amount-input').type('abdc');
            cy.getQa('main-form-save-btn').should('be.disabled');
        }); 

    });

    describe('Check the save button on the edit form on the history page', function () {
        before(() => {
            cy.visit('/').then(() => {
                window.localStorage.setItem('myExpenses', JSON.stringify(testExpenses))
                cy.visit('/history/').then(() => {
                    cy.getQa('history-edit-btn').eq(0).click();
                });
            });
            
        });   

        it('should open the first entry and check the button is disabled on open', function () {
            cy.getQa('history-form-save-btn').should('be.disabled');
        });  

        it('should open the first entry and check the button is disabled if user enters 0', function () {
            cy.getQa('history-form-amount-input').clear().type('0');
            cy.getQa('history-form-save-btn').should('be.disabled');
        });  

        it('should open the first entry and check the button is disabled if user enters NaN', function () {
            cy.getQa('history-form-amount-input').clear().type('abdc');
            cy.getQa('history-form-save-btn').should('be.disabled');
        }); 

        it('should open the first entry and check the button is not disabled if user enters the valid number 6', function () {
            cy.getQa('history-form-amount-input').clear().type('6');
            cy.getQa('history-form-save-btn').should('not.be.disabled');
        }); 
    });
});
