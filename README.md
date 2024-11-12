# DjangoAir ERP System Analysis and Decomposition

## Project Overview

DjangoAir is an ERP system designed to unify multiple services, primarily a booking and check-in service, within one comprehensive platform. The application supports independent web interfaces for customers and staff, each tailored to meet specific user needs and workflows. It aims to streamline ticket booking, boarding, and check-in processes with the flexibility for role-based staff access, social login, and payment integrations.

---

## Run the application locally
- Clone the app ```git@git.foxminded.ua:foxstudent107363/djangoair-erp-task-19-djangoair-erp-system.git```
- Run ```make init``` for installing all dependencies 
- Run ```make initdb``` for creating of database (optional)
- Run ```make run``` for running the app
- Open the url http://localhost:8000 with app page
- Create your login and password

## Running the tests
Run ```make test``` in CLI

## Demo
[See demo by link on AWS](http://ec2-18-192-66-86.eu-central-1.compute.amazonaws.com:8000/)<br/>


---

## Project Structure Breakdown

### Core Modules

1. **Booking and Ticketing**
   - **Customer Interface**: A simple, intuitive screen for customers to book flights by selecting the destination, date, and number of passengers.
   - **Staff Interface**: Accessible by staff roles with varying levels of permissions, including check-in, boarding, and flight management.

2. **Staff Role Management**
   - Provides role-based access control with predefined roles:
     - **Gate Manager**: Manages passenger boarding at the gate.
     - **Check-in Manager**: Handles passenger check-in, adds options, and takes luggage fees.
     - **Supervisor**: Has full control, including managing flights, options, and staff roles.

3. **Optional Features**
   - **Social Login**: Enables login via Google or Facebook.
   - **Payment Integration**: Adds a step for payment with third-party open-source emulation.
   - **API and Mobile Integration**: Flask-based API for mobile and third-party services.

4. **Entities and Models**
   - Core entities for flight management include `Flight`, `Passenger`, `Ticket`, `SeatType`, `Option`, and `Discount`.

5. **Notification and Emailing**
   - Sends tickets and bills to customers via email and provides check-in reminders.

6. **Frontend Interface**
   - Customer-facing Vue.js components for booking, account management, and notifications.
   - Staff interface for handling check-in, boarding, and gate management.

---

## Modules and Functionality

### Detailed Modules

1. **`flights`**
   - **Models**:
     - `Flight`: Stores flight data including destination, date, and status.
     - `Airplane`: Stores data related to the aircraft.
     - `SeatType`: Defines seating classes.
   - **Views**:
     - Interface for customers to search and book flights.
   - **Admin**:
     - Allows supervisors to create, cancel, and manage flights.

2. **`tickets`**
   - **Models**:
     - `Ticket`: Stores ticket and boarding information.
     - `Option`: Add-ons like luggage, meals, etc.
     - `Discount`: Manages promotional discounts.
   - **Views**:
     - Manages ticket booking, invoicing, and add-on options.
   - **Admin**:
     - Provides control over ticketing, options, and discounts.

3. **`passengers`**
   - **Models**:
     - `Passenger`: Links to the `User` model, storing customer data.
   - **Views**:
     - Customer dashboard with flight history and balance.
   - **Admin**:
     - Management of passenger details.

4. **`accounts`**
   - **Models**:
     - `User`: Stores credentials with roles for different staff permissions.
   - **Views**:
     - Handles customer registration, login, and social login.
   - **Admin**:
     - Allows supervisors to manage staff roles and access levels.

5. **`check_in`**
   - **Models**:
     - Logs boarding and check-in statuses.
   - **Views**:
     - Staff views for managing check-ins and boarding status.
   - **Admin**:
     - Enables monitoring of passenger check-in status.

6. **`payment`** (Optional)
   - **Models**:
     - `Payment`: Stores payment information and transaction status.
   - **Views**:
     - Integrates payment gateway in the booking process.
   - **Admin**:
     - Manages transaction records and payment statuses.

7. **`notifications`**
   - **Models**: Notification logs.
   - **Services**:
     - Sends flight notifications and updates via email/webhooks.

8. **`api`** (Optional)
   - **Mobile Integration**:
     - REST and WebSocket API built with Flask.
   - **Third-Party Integrations**:
     - Webhooks to provide booking and flight information to third-party systems.

---
## UML Class Diagram
[Link to UNL Diagram](https://drive.google.com/file/d/1IbQ4mTnM8172kWEJiZocK7yCC1lfOYRU/view?usp=sharing)

### Class Diagram Structure

---
## Development Plan

### Priority Steps

1. **Core Model and Database Setup**
   - **Goal**: Establish the foundational entities and relationships in PostgreSQL.
   - **Steps**:
     - Define essential entities: `Flight`, `Passenger`, `Ticket`, `SeatType`, `Option`, and `Discount`.
     - Establish relationships between these entities.
     - Migrate models and ensure integrity of the data structure.

2. **Customer Booking Interface**
   - **Goal**: Build the user-facing interface for booking flights.
   - **Steps**:
     - Implement the initial screen for customers to select destination, date, and passenger count.
     - Add a screen to display available seats, pricing, and additional options like meals and luggage.
     - Create a final booking screen with payment information, confirmation, and email receipt.

3. **Staff Role-Based Access Control (RBAC)**
   - **Goal**: Ensure secure access based on staff roles.
   - **Steps**:
     - Implement roles for `Gate Manager`, `Check-in Manager`, and `Supervisor` with Django’s permissions system.
     - Develop workflows for each role, granting access to relevant actions (e.g., gate access, check-in, and flight management).
     - Set up access restrictions and testing to verify correct role behaviors.

4. **Notifications System**
   - **Goal**: Provide timely notifications for bookings and updates.
   - **Steps**:
     - Configure email and webhook notifications to inform customers about booking confirmations and updates.
     - Use Celery for asynchronous task management to ensure notifications are sent without blocking main application threads.
     - Test notifications across scenarios to confirm reliable delivery.

5. **Optional Integrations**
   - **Goal**: Enhance the booking system with social login, payment, and API support.
   - **Steps**:
     - **Social Login**: Integrate a social login provider (e.g., Google or Facebook) for enhanced customer convenience.
     - **Payment Integration**: Implement a third-party payment emulator to provide a realistic booking experience.
     - **API for Mobile and Third-Party Services**: Use Flask to build a REST API for mobile applications and webhooks for third-party integrations.

### Secondary Steps

1. **Enhanced Customer Dashboard**
   - **Goal**: Improve the user experience with an organized customer dashboard.
   - **Steps**:
     - Implement a dashboard displaying future and past flights, balance, and online check-in options.
     - Ensure user-friendly navigation and design continuity with the booking flow.

2. **Testing and Mocks for API**
   - **Goal**: Guarantee reliability and functionality of the API and notifications.
   - **Steps**:
     - Write unit and integration tests for the Flask API.
     - Create mock webhooks to test third-party service integrations.

3. **Deployment and Scaling Setup**
   - **Goal**: Prepare the application for deployment and ensure scalability.
   - **Steps**:
     - Dockerize the application for portability and ease of deployment.
     - Set up Nginx as the web server and conduct deployment tests.
     - Configure Redis and PostgreSQL for efficient data handling and scalability.

4. **Performance Optimization and Load Testing**
   - **Goal**: Ensure optimal performance for high-traffic scenarios.
   - **Steps**:
     - Optimize database queries and monitor application performance.
     - Conduct load testing to evaluate system behavior under increased traffic.
     - Implement caching where needed to reduce load and improve response times.