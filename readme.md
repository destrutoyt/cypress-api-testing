# Cypress API Testing 💻

This repository contains a suite of **API tests** built using **Cypress**, validating core endpoints of the Conduit API (RealWorld app implementation). It's a practical demonstration of automated back-end testing with clear error handling, response verification, and request interception.

## 🏆 Highlights
- Clearly separates successful creation from error cases (`title must be unique`)
- Demonstrates request interception and response modification
- Logs and throws errors when tests detect unexpected API behavior
- Easily extendable for other endpoints (comments, users, tags, favorites)
- Combines API testing with Dockerized environments

## 🧰 Tech Stack

- [Cypress](https://www.cypress.io) — test runner for API testing using `cy.request()` and `cy.intercept()`
- JavaScript (ES6+) syntax
- **Docker** — for isolated, reproducible test execution


## 🚀 Getting Started


### Prerequisites

- Node.js v16+ (with npm)
- Docker (optional but recommended)
- A working clone of this repo

### Installation

```bash
git clone https://github.com/destrutoyt/Cypress-API-Testing.git
cd Cypress-API-Testing
npm install
```

### 🐳 Running with Docker
You can also execute the Cypress tests inside a Docker container for a clean and consistent environment:

Build the Docker image:
```
docker build -t cypress-api-tests .
```
Run the tests:
```
docker run -it cypress-api-tests
```

This is useful when running tests in CI/CD pipelines or avoiding local environment conflicts.
