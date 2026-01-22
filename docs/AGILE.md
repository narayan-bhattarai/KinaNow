# Agile / Scrum Artifacts

## 📌 Epics

### Epic 1: Core Commerce Platform
**Goal**: Enable users to browse products, manage cart, and place orders.
*   **User Stories**:
    *   As a user, I want to register and login so I can access my account.
    *   As a user, I want to browse products by category so I can find what I need.
    *   As a user, I want to add items to my cart so I can purchase them later.
    *   As a user, I want to place an order so I can receive my items.

### Epic 2: Seller Portal & Admin
**Goal**: Enable sellers to manage inventory and admins to oversee the platform.
*   **User Stories**:
    *   As a seller, I want to add new products so customers can buy them.
    *   As an admin, I want to view platform analytics so I can track performance.

### Epic 3: Notifications & Reviews
**Goal**: Enhance engagement and trust.
*   **User Stories**:
    *   As a user, I want to receive an email when my order is shipped.
    *   As a user, I want to rate products so others can know about quality.

---

## 📅 Sprint Plan (2 Sprints)

### Sprint 1: Foundation & MVP Flow
*   **Goal**: Working end-to-end "Happy Path" (Login -> Browse -> Cart -> Checkout).
*   **Deliverables**:
    *   Infrastructure (Docker Compose for Postgres/Kafka).
    *   Auth Service (JWT, Login/Register).
    *   Catalog Service (Product CRUD, Search).
    *   Cart Service (Add/Remove items).
    *   Order Service (Create Order, Publish "OrderCreated").
    *   Angular Frontend (Basic Layout, Login, Product List, Cart).

### Sprint 2: Fulfillment, Inventory & Polish
*   **Goal**: Complete the lifecycle (Payment, Inventory, Notifications) and UI polish.
*   **Deliverables**:
    *   Inventory Service (Stock tracking, Kafka Listener).
    *   Payment Service (Mock payment processing).
    *   Notification Service (Email stub).
    *   Review Service.
    *   Admin Dashboard (Angular).
    *   Comprehensive Unit/Integration Tests.

---

## ✅ Definition of Done (DoD)
1.  **Code Functional**: Feature works as per acceptance criteria.
2.  **Tested**: Unit tests written (min 80% coverage for domain logic). Integration tests for API endpoints.
3.  **Documented**: API endpoints documented in OpenAPI/Swagger.
4.  **Reviewed**: Code reviewed via PR.
5.  **CI Passed**: Build and tests pass in CI pipeline.
6.  **No Critical Bugs**: No P0/P1 bugs open.

---

## 📝 Pull Request Template

```markdown
### Description
[Describe what this PR does]

### Related Issue
Closes #[Issue Number]

### Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation

### Testing
- [ ] Unit Tests Added
- [ ] Integration Tests Added
- [ ] Manual Testing Verified

### Checklist
- [ ] My code follows the code style of this project.
- [ ] I have updated the documentation accordingly.
- [ ] I have not introduced new linter errors.
```
