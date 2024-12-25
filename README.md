# Air ERP System Analysis and Decomposition

## Project Overview

Air ERP System designed to unify multiple services, primarily a booking and check-in service, within one comprehensive platform. 
The application supports independent web interfaces for customers and staff, each tailored to meet specific user needs and workflows. 
It aims to streamline ticket booking, boarding, and check-in processes with the flexibility for role-based staff access, and payment integrations.

---

## Run the application locally
- Clone the app
- Run ```make init``` for installing all dependencies 
- Run ```make initdb``` for creating of database (optional)
- Run ```make run``` for running the app
- Open the url http://localhost:8000 with app page
- Create your login and password

## Running the tests
Run ```make test``` in CLI

## Demo

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
   - Customer-facing React.js components for booking, account management, and notifications.
   - Staff interface for handling check-in, boarding, and gate management.