describe('Test with Backend', () => {

  beforeEach('login to application', () => {
    cy.intercept({method:'GET', path:'tags'}, {fixture: 'tags.json'}) // Intercepting the request to tags and returning the fixture.
    cy.loginToApp()
  })

  it('Verify correct request and response', () => {
    
    cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles')

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is a title')   // Must be unique
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is a body')
    cy.contains('Publish Article').click()


    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)   // Code 201 means Created, if article is created again, it will be 422 because it is already created and "TITLE" must be unique.
      expect(xhr.request.body.article.body).to.equal('This is a body')
      expect(xhr.response.body.article.description).to.equal('This is a description')
    })

  })


  it('Intercepting and Modifiying the request and response', () => {   
    // cy.intercept('POST', '**/articles', (req) => {
    //   req.body.article.description = 'This is a modified description'
    // }).as('postArticles')

    cy.intercept('POST', '**/articles', (req) => {
      req.reply(async (res) => {
        await res.send();

        if (res.statusCode === 201 && res.body.article) {
          expect(res.body.article.description).to.equal('This is a description');
          res.body.article.description = 'Modified description';
        } else {
          console.warn('Article not created. Response:', res.body);
          throw new Error('Article creation failed: ' + JSON.stringify(res.body.errors));
        }

        return res;
      });
    }).as('postArticles');


    const uniqueTitle = 'This is a title ' + Date.now();

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type(uniqueTitle)   // Must be unique
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is a body')
    cy.contains('Publish Article').click()


    cy.wait('@postArticles').then( xhr => {
      console.log("After publishing Article: " + xhr)
      expect(xhr.response.statusCode).to.equal(201)   // Code 201 means Created, if article is created again, it will be 422 because it is already created and "TITLE" must be unique.
      expect(xhr.request.body.article.body).to.equal('This is a body')
      expect(xhr.response.body.article.description).to.equal('This is a description')
    })
  })

  it('Verify popular tags are displayed', () => {
    cy.get('.tag-list')
    .should('contain', 'Test Automation')
    .and('contain', 'Automation')
    .and('contain', 'Tags Switched')
  })

  it('Verify global feed likes count', () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', {"articles":[],"articlesCount":0}) // * means that it can be any 
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', {fixture: 'articles.json'})

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(heartList => {
      expect(heartList[0]).to.contain('1')
      expect(heartList[1]).to.contain('5')
    })

    cy.fixture('articles.json').then( file => {   // If an extension is not specified, Cypress will look for the file in the "cypress/fixtures" folder
      
      const articleLink = file.articles[1].slug
      file.articles[1].favoritesCount = 6
      cy.intercept('POST', Cypress.env('apiUrl')+'/api/articles/'+articleLink+'/favorite', file)

    })

    cy.get('app-article-list button').eq(1).click().should('contain', '6')

  })

  it('Delete a new article in a global feed', () => {
    const bodyRequest = {
      "article": {
          "title": "API Testing",
          "description": "This too izi",
          "body": "Really?",
          "tagList": []
      }
    }

    cy.get('@token').then( token => {

      cy.request({
        url: Cypress.env('apiUrl')+'/api/articles',
        headers: { 'Authorization': 'Token ' + token },
        method: 'POST',
        body: bodyRequest
      }).then( response => {
        expect(response.status).to.equal(201)
      })

      cy.contains('Global Feed').click()
      cy.wait(2000)
      cy.get('.article-preview').first().click()
      cy.get('.article-actions').contains('Delete Article').click()

      cy.request({
        url: Cypress.env('apiUrl')+'/api/articles?limit=10&offset=0',
        headers: { 'Authorization': 'Token ' + token },
        method: 'GET'
      }).its('body').then( body => {
        expect(body.articles[0].title).not.to.equal('API Testing')
      })
    })
  })
})