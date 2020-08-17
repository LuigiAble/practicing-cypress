import {buildUser} from '../support/generate'

Cypress.Commands.add('createUser', () => {
  const user = buildUser()
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/register',
    body: user,
  }).then(response => ({
    ...response.body.user,
    ...user,
  }))
})

Cypress.Commands.add('loginUser', user => {
  cy.request({
    url: 'http://localhost:3000/login',
    method: 'POST',
    body: user,
  }).then(response => {
    window.localStorage.setItem('token', response.body.user.token)
    return {...response.body.user, ...user}
  })
})

Cypress.Commands.add('loginAsNewUser', () => {
  cy.createUser().then(user => {
    cy.loginUser(user)
  })
})

Cypress.Commands.add('assertHome', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/`)
})

Cypress.Commands.add('assertLoggedInAs', user => {
  cy.window()
    .its('localStorage.token')
    .should('be.a', 'string')
  cy.findByTestId('username-display').should('have.text', user.username)
})
