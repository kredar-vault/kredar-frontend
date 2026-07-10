# Kredar Business Flow

## Overview

Kredar is a fintech infrastructure platform that enables businesses to manage customers, issue Dedicated Virtual Accounts (DVAs), receive payments, reconcile transactions automatically, and settle funds—all from a single dashboard.

The platform is designed for two types of users:

- **Developers** integrating Kredar through APIs.
- **Business owners and operations teams** managing customers without writing code.

---

# High-Level Flow

```text
Merchant Registration
        │
        ▼
Authentication
        │
        ▼
Business Profile Setup
        │
        ▼
Dashboard
        │
        ├───────────────┐
        ▼               ▼
Team Management     API Keys
        │
        ▼
Customer Management
        │
        ▼
Create Customer
        │
        ▼
Automatically Generate Dedicated Virtual Account
        │
        ▼
Share Account Details with Customer
        │
        ▼
Customer Sends Money
        │
        ▼
Transaction Recorded
        │
        ▼
Automatic Reconciliation
        │
        ▼
Business Balance Updated
        │
        ▼
Settlement
```

---

# 1. Merchant Authentication

Merchant creates an account.

### Signup

```
POST /auth/signup
```

Merchant verifies email using OTP.

```
POST /auth/verify
```

Merchant logs in.

```
POST /auth/login
```

Merchant receives:

- Access Token
- Refresh Token

---

# 2. Business (Tenant) Profile

After login, merchant completes business information.

Examples:

- Business Name
- Company Address
- Contact Information
- Business Category

Endpoints

```
GET /tenant/profile

PATCH /tenant/profile
```

---

# 3. Team Management

Business owners can invite staff members.

Roles may include:

- Owner
- Admin
- Finance
- Operations
- Customer Support

Endpoints

```
GET /team

POST /team

PATCH /team/{id}

DELETE /team/{id}
```

---

# 4. API Keys

Developers create API keys to integrate with Kredar.

Two environments:

- Test
- Live

Each key is used to authenticate API requests.

---

# 5. Customer Management

Merchant creates customers.

```
POST /customers
```

Customer information includes:

- First Name
- Last Name
- Email
- Phone Number

Customer immediately appears inside the dashboard.

---

# 6. Dedicated Virtual Account (DVA)

Immediately after customer creation, a Dedicated Virtual Account should be created automatically.

Recommended backend flow:

```text
POST /customers

↓

Customer Created

↓

POST /dedicated-accounts

↓

Dedicated Account Created

↓

Attach DVA to Customer
```

Merchant should never have to manually create the DVA.

The customer immediately receives:

- Account Number
- Bank Name
- Account Name

---

# 7. KYC

Merchant uploads customer documents.

```
POST /customers/{id}/kyc
```

Admin approves or rejects.

```
PATCH /customers/kyc/{docId}/status
```

Customer becomes:

- Pending
- Verified
- Rejected

---

# 8. Receiving Payments

Merchant shares the customer's Dedicated Virtual Account.

Customer transfers money from any Nigerian bank.

```text
Customer

↓

Dedicated Virtual Account

↓

Bank

↓

Kredar
```

---

# 9. Transactions

Every payment automatically creates a transaction.

Endpoints

```
GET /transactions

GET /transactions/{id}

GET /customers/{customerId}/transactions
```

Each transaction contains:

- Amount
- Status
- Reference
- Date
- Customer
- Dedicated Account

---

# 10. Automatic Reconciliation

This is the core of Kredar.

Every incoming payment is automatically matched against:

```text
Incoming Transfer

↓

Dedicated Virtual Account

↓

Customer

↓

Merchant

↓

Transaction

↓

Marked as Reconciled
```

No manual matching is required.

---

# 11. Business Balance

Once reconciliation succeeds:

Business balance updates automatically.

Dashboard shows:

- Available Balance
- Total Volume
- Successful Transactions
- Pending Transactions

---

# 12. Settlement

Merchant transfers money to their business bank account.

Settlement flow:

```text
Available Balance

↓

Settlement Request

↓

Bank Transfer

↓

Completed
```

Settlement history includes:

- Amount
- Date
- Status
- Destination Bank
- Reference

---

# 13. Webhooks

Whenever an important event occurs, Kredar sends webhook notifications.

Examples:

```
customer.created

customer.updated

customer.deleted

dva.created

transaction.success

transaction.failed

settlement.completed

settlement.failed

kyc.approved

kyc.rejected
```

This allows merchants to automate their own systems.

---

# 14. Dashboard Modules

Current modules include:

- Dashboard
- Customers
- Dedicated Virtual Accounts
- Transactions
- Balance
- KYC
- Team
- API Keys
- Tenant Profile
- Settings

---

# Enterprise Features

The following modules improve operations and business visibility.

## Operations Center

Monitor:

- Failed Transactions
- Pending Settlements
- Failed Webhooks
- Pending KYC
- System Alerts

---

## Business Activity

Activity feed showing:

- Customer Created
- DVA Created
- KYC Approved
- Transaction Received
- Settlement Completed
- Team Member Added

---

## Customer Notes

Each customer can have internal notes.

Examples:

- Customer requested callback
- Waiting for documents
- VIP customer
- Refund requested

---

## Customer Timeline

A chronological timeline combining:

- Customer Created
- DVA Generated
- Transactions
- Notes
- KYC
- Settlements

Everything about one customer in one place.

---

## Reconciliation Center

Displays:

- Reconciled Payments
- Pending Reconciliation
- Failed Reconciliation

Allows Operations teams to monitor incoming funds.

---

## API Playground

Developers can:

- Test endpoints
- View request
- View response
- Copy cURL
- Copy JSON

Without leaving the dashboard.

---

## API Request Explorer

Displays:

- Endpoint
- Method
- Status Code
- Response Time
- API Key Used
- Timestamp

Useful for debugging integrations.

---

## Webhook Logs

Displays every webhook sent.

Information includes:

- Event
- Delivery Status
- Attempts
- Response Code
- Retry Button

---

## Merchant Inbox

Central notification center.

Examples:

- Settlement Completed
- KYC Approved
- Webhook Failed
- API Key Expiring
- Customer Added

---

## CSV Import

Businesses can import hundreds or thousands of customers.

CSV Import Flow

```text
Upload CSV

↓

Validate Rows

↓

Preview Data

↓

Import Customers

↓

Automatically Generate DVAs

↓

Download Error Report (if needed)
```

---

## Audit Logs

Tracks every important action.

Examples:

- Customer Created
- API Key Generated
- Team Member Added
- Settlement Initiated
- Customer Deleted

Useful for compliance.

---

# Complete Customer Lifecycle

```text
Create Customer
        │
        ▼
Generate Dedicated Virtual Account
        │
        ▼
Customer Receives Account Details
        │
        ▼
Customer Makes Payment
        │
        ▼
Transaction Recorded
        │
        ▼
Automatic Reconciliation
        │
        ▼
Business Balance Updated
        │
        ▼
Settlement Requested
        │
        ▼
Settlement Completed
```

---

# Complete Merchant Lifecycle

```text
Sign Up
        │
        ▼
Verify Email
        │
        ▼
Login
        │
        ▼
Complete Business Profile
        │
        ▼
Invite Team Members
        │
        ▼
Generate API Keys (Optional)
        │
        ▼
Create Customers
        │
        ▼
Automatically Generate DVAs
        │
        ▼
Customers Make Payments
        │
        ▼
Transactions Recorded
        │
        ▼
Automatic Reconciliation
        │
        ▼
Balance Updated
        │
        ▼
Withdraw / Settle Funds
```

---

# Core Modules

- Authentication
- Dashboard
- Customers
- Dedicated Virtual Accounts
- Transactions
- Balances
- Settlements
- KYC
- Team Management
- Tenant Profile
- API Keys
- Webhooks
- Operations Center
- Business Activity
- Customer Notes
- Customer Timeline
- Reconciliation Center
- API Playground
- API Request Explorer
- Merchant Inbox
- Audit Logs
- CSV Import
- Settings

---

# Vision

Kredar removes the complexity of receiving and managing payments.

A merchant should only need to:

1. Create a customer.
2. Let Kredar automatically generate a Dedicated Virtual Account.
3. Share the account details with the customer.
4. Receive payments.
5. Watch transactions reconcile automatically.
6. Monitor balances.
7. Settle funds to their business account.

Everything else should be handled by Kredar's infrastructure.