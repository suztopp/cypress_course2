/// <reference types="cypress" />

describe('Test with backend', () => {

    beforeEach('login to the app', () => {
        cy.server()
        cy.route('GET', 'http://localhost:3000/api/tags', 'fixture:tags.json')
        cy.logintoapplication()
    })

    it.skip('verify correct request and response', () => {

        //listen to the api and assign to variable
        cy.server()
        cy.route('POST', '**/articles').as('postArticles')

        //perform ops to trigger api article
        cy.contains('New Article').click()
        cy.get('[placeholder="Article Title"]').type('This is the title') 
        cy.get(`[placeholder="What's this article about?"]`).type('This is the description')
        cy.get('[placeholder="Write your article (in markdown)"]').type('This is the body of the article')
        cy.contains('Publish Article').click()

        //have to wait on the variable after triggering above
        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.status).to.eq(200)
            expect(xhr.request.body.article.body).to.eq('This is the body of the article')
            expect(xhr.response.body.article.description).to.eq('This is the description')
            //access the json object as needed
        })
    })

    it.skip('should give tags with routing object', () => {
        cy.get('.tag-list')
        .should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'testing')
    })

    it('verify global feed likes count', () => {

        cy.route('GET', 'http://localhost:3000/api/articles/feed', '{"articles":[],"articlesCount":0}')
        cy.route('GET', 'http://localhost:3000/api/articles', 'fixture:articles.json')

        cy.contains('Global Feed').click()

    })

})

// cy.intercept()

