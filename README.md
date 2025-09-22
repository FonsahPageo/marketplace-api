# Marketplace API

A **Node.js + Express** REST API for user authentication and CRUD operations for product management.

---

## Features

- User registration & login with secure password hashing (`bcrypt`)
- JWT-based authentication (access & refresh tokens)
- Logout and token revocation
- Product management (CRUD)
- Role based access control (with **admin** role)
- Comprehensive test with **Jest** and **Supertest**
- Users can:
    - View all products
    - Search for a particular product
    - Create new products
    - Update or delete products (**only those created by themselves**)
- Admin can:
    - Perform actions like any user
    - See other user information (**except password**)
- Input validation using **Joi**
- Environment variable configuration with **dotenv**

## Tech stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Auth:** JWT (Access & Refresh Tokens), bcrypt
- **Validation:** Joi
- **Testing:** Jest, Supertest
- **Environment Config:** dotenv
- **API Platform:** Postman

## API Structure

```
src/
|---app.js                    # Main Express app configuration
|---index.js                  # Server entry point
|---config/                   # Configuration files
|    |---db.js                # Database connection configuration
|---data/                     # Database initialization scripts
|    |---createTables.js      # Table creation scripts
|---models/                   # Data models (Service Layer)
|    |---userModel.js         # User data operations
|    |---productModel.js      # Product data operations
|    |---tokenModel.js        # Token management operations
|---controllers/              # Route handlers (Controller Layer)
|    |---userController.js    # User route handlers
|    |---productController.js # Product route handlers
|---routes/                   # Route definitions
|    |---userRoutes.js        # User API routes
|    |---productRoutes.js     # Product API routes
|---middlewares/              # Custom middleware
|    |---authMiddleware.js    # Authentication & authorization
|    |---inputValidator.js    # Request validation
|    |---errorHandling.js     # Error handling middleware
|---utils/                    # Utility functions
|    |---jwt.js               # JWT token utilities
```

## Database structure

### Users table

- Stores user information during registration (firstName, lastName, username, email, password, role)
- Uses bcrypt to hash passwords before storing for security

### Product table

- Stores information about products created (title, description, price, image)
- It is not a good practice to store images in the database, so it's better to host them elsewhere and reference with the URL, for instance Amazon S3. So the image url is rather stored as a string

---

## Getting started

### Clone the repository 

```bash
git clone https://github.com/FonsahPageo/marketplace-api.git

cd marketplace-api

npm install

mv .env.example .env

npm run dev
```

**NOTE:** Edit the `.env` file to fill in the required parameters such as **database** **name**, **port** etc.

for instance

`.env`
```bash
PORT=8000
JWT_SECRET=supersecretkey
REFRESH_SECRET=superrefreshsecretkey
DB_USER=user
DB_HOST=host
DB_DATABASE=database
DB_PORTDB_PASSWORD=password
```

Open **Postman** or any API platform, create a new collection for the various endpoints, make requests to test the different API endpoints.

## Testing

The project includes a comprehensive test suite using Jest and Supertest.

### Running tests (in terminal)

```bash
# run all tests
npm test

# run tests in watch mode
npm run test:watch

# run tests with coverage report
npm run test:coverage

```

### Test Structure
```
tests/
|---unit/                        # unit tests for individual components
|    |---jwt.test.js             # JWT utility tests
|    |---userModel.test.js       # User model tests
|    |---productModel.test.js    # Product model tests
|    |---validator.test.js       # Input validation tests
|---integration/                 # integration tests API Endpoints
|    |---auth.test.js            # Authentication flow tests
|    |---users.test.js           # User API tests
|    |---product.test.js         # Product API tests
|---setup.js                     # Test database setup
```

### Test Environment

Tests run against a dedicate test database setup with:
- Automatic table creation and data cleanup
- Isolated test environment with separate database
- JWT token generation and validation testing
- Input validation and schema testing

### Key test features

- Unit Tests: Core logic (JWT, models, validators)
- Integration Tests: Full API endpoint testing
- Authenticatin flow: Register, login, logout
- CRUD Operations: Product creation, reading, updating, deletion
- Error Handling: Invalid input and edge cases
- Database Isolation: Clean state for each test suite

## API Documentation

Ensure to change **DB_HOST** and **DB_PORT** to the values defined in your `.env` file

### Authentication

#### Create User
POST /register
![Register User](./screenshots/register.png)

#### Login User
POST /login
![Login User](./screenshots/login.png)

#### View Users (only admin)
GET /users
![View Users](./screenshots/get_users.png)

#### Create product

POST /products
![Create Product](./screenshots/create_product.png)

#### View products
GET /products
![View Products](./screenshots/get_products.png)

#### Modify product
PATCH /update
![Modify Product](./screenshots/modify_product.png)

#### Delete product
DELETE /delete
![Delete Product](./screenshots/delete_product.png)

## Notes
- When logging in, an access token is generated. it will be used as bearer authorization in the header for creating and managing products as well as to logout.
- Products are associated with the ID of the user that created them, therefore can only be deleted by that user.
- Only persons with role=admin can see or search users. But everyone can view products, create products, delete their own products.