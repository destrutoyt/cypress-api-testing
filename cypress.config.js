const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  env: {  // Environment variables. You can access them using Cypress.env('variableName'). This allows you to keep sensitive data out of your codebase and easily change them without modifying the code.
    username: 'destro@gmail.com',
    password: 'destro789',
    apiUrl: 'https://conduit-api.bondaracademy.com',
  },
  retries: {
    runMode: 2,  // Number of retries when running tests in the run mode (Cypress Test Runner)
    openMode: 0, // Number of retries when running tests in the open mode (Visually Testing)
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    baseUrl: "https://conduit.bondaracademy.com/",
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },

});
