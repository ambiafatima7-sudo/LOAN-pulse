# LoanPulse - Loan Management System

Full Stack project (P_019, Banking & Finance): loan application processing, risk assessment,
disbursement and repayment tracking with notifications.

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Python, Django, Django REST Framework, JWT (SimpleJWT)
- **Database:** Oracle Database 21c XE (via `oracledb`)

## Features
- Register and login with JWT authentication
- Loan application with rule-based risk score (Low / Medium / High)
- Admin approve, reject and disburse
- Automatic EMI schedule generation and EMI payment tracking
- Customer dashboard with summary cards and repayment progress
- In-app notifications
- Landing page with EMI calculator

## Project Structure
```
loanpulse/
├── backend/    Django + DRF (config/, loans/)
└── frontend/   React + Vite (src/pages, src/services)
```

## Setup

### 1. Database (Oracle XE)
Run as SYSTEM in SQL*Plus or SQL Developer:
```sql
ALTER SESSION SET CONTAINER = XEPDB1;
CREATE USER loanpulse IDENTIFIED BY <password>;
GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO loanpulse;
GRANT CREATE VIEW, CREATE SEQUENCE TO loanpulse;
```

### 2. Backend
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
Create `backend/.env` (this file is not committed to Git):
```
DB_USER=loanpulse
DB_PASSWORD=<password>
DB_DSN=localhost:1521/XEPDB1
```
Then:
```
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Backend runs at http://127.0.0.1:8000

### 3. Frontend
```
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

## Run Tests
```
cd backend
python manage.py test --settings=config.test_settings -v 2
```
Tests use an in-memory SQLite database, so Oracle data is not touched.

## Usage
1. Register a customer at `/register`, log in, and apply for a loan at `/loans`.
2. Log in as the admin (superuser) and Approve, then Disburse the loan.
3. The customer sees the EMI table and can pay EMIs.

## API (prefix `/api/`)
| Method | Endpoint | Access |
|---|---|---|
| POST | /register/, /login/, /token/refresh/ | Public |
| GET | /me/, /loans/, /notifications/ | Authenticated |
| POST | /loans/ | Customer |
| POST | /loans/{id}/decide/, /loans/{id}/disburse/ | Admin |
| POST | /repayments/{id}/pay/ | Customer |

## Author
Ambia Fatima
