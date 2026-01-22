# 🎓 Learning Map

How **KinaNow** maps to core Software Engineering and Architecture Skills.

## 🏗️ Architecture & Design
| Module | Concepts Taught |
| :--- | :--- |
| **API Gateway** | API Composition, Routing, Circuit Breaking, Rate Limiting. |
| **Config Server** | Externalized Configuration, GitOps basics, Runtime config Refresh. |
| **Microservices** | Distributed Systems constraints, Service Boundaries, Bounded Contexts. |

## ☕ Java & Spring Boot
| Module | Concepts Taught |
| :--- | :--- |
| **Auth Service** | Spring Security 6, OAuth2 Resource Server, JWT issuance/validation, Refresh Tokens. |
| **Order Service** | State Machines, Saga Pattern (Orchestration vs Choreography), Transactional Outbox (concept). |
| **Catalog Service** | Spring Data MongoDB, NoSQL data modeling, Text Search. |
| **Inventory Service** | Optimistic Locking (`@Version`), Concurrency control, Postgres reliability. |

## 📨 Event-Driven Architecture (Kafka)
| Module | Concepts Taught |
| :--- | :--- |
| **Order -> Inventory** | Asynchronous communication, Decoupling services. |
| **Notification** | Consumer Groups, Idempotency, Dead Letter Queues (DLQ), Retry strategies. |

## 🧪 Testing & DevOps
| Module | Concepts Taught |
| :--- | :--- |
| **Unit Testing** | `Mockito`, `JUnit 5` for isolated business logic tests. |
| **Integration** | `@DataJpaTest` for DB, `MockMvc` for REST, **Testcontainers** for real infratest. |
| **Docker** | Containerizing JARs, Multi-stage builds, Docker Compose orchestration. |

## 💻 Frontend (Angular)
| Module | Concepts Taught |
| :--- | :--- |
| **Core** | Standalone Components, Signals vs RxJS, Dependency Injection. |
| **State** | NgRx (Store, Effects, Selectors) for managing Cart/User state globally. |
| **Security** | HTTP Interceptors for JWT Injection & Auto-Refresh, Route Guards. |

