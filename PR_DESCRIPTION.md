# Pull Request: Grozo Replenishment Control Tower & RBAC Login Portal

## 📌 Summary of Changes

This Pull Request introduces **Grozo - Replenishment Control Tower** featuring full **End-to-End Authentication (Frontend + Express REST API)** and **Role-Based Access Control (RBAC)** across 5 operational enterprise roles.

---

## ✨ Features Introduced

### 1. Authentication & RBAC Login Portal (`src/components/LoginPage.jsx`)
- Modern glassmorphic Login UI with Light Mode (☀️) and Dark Mode (🌙) support.
- Credential Form (Email, Password, Role Scope selector).
- **Quick 1-Click Persona Login Tiles** for instant testing:
  - 🏪 **Store Manager**: `sarah.jenkins@grozo.com` (Store #101)
  - 📋 **Replenishment Planner**: `mark.taylor@grozo.com` (Central Planning)
  - 🚚 **Warehouse Dispatcher**: `jim.carter@grozo.com` (Warehouse WMS)
  - 📊 **Regional Operations Manager**: `alex.morgan@grozo.com` (Region Ops)
  - 🛡️ **System Administrator**: `admin@grozo.com` (Enterprise Admin)

### 2. Express REST API Backend (`server/index.js`)
- `POST /api/auth/login`: Authenticates credentials, validates RBAC roles, generates bearer session tokens, and records audit trail events.
- `GET /api/auth/me`: Session token verification endpoint.
- `GET /api/requests`, `POST /api/requests`, `PUT /api/requests/:id/status`: Full order lifecycle endpoints.

### 3. Strict RBAC Workspace Scoping (`src/components/Header.jsx`)
- Header dynamically reflects the logged-in user's permitted role workspace. Unprivileged role switcher buttons are hidden for non-admin users.

### 4. Supabase / Firebase Style Auth Console (`src/components/AdminView.jsx`)
- Interactive User Accounts Table displaying registered users, IDs, emails, roles, assigned store/region scope, session tokens, and verified status.

### 5. Cross-Platform Flutter & Firebase Integration (`lib/`)
- Flutter domain models, `FirebaseService` stream subscriptions, and production Cloud Firestore security rules (`firebase/firestore.rules`).

---

## 🛠️ Verification & Testing
- **Backend API**: Verified running on `http://localhost:5000` (HTTP 200 OK).
- **Frontend App**: Verified Vite production build (`npm run build`) completed with 0 errors.

---

## 🔗 Direct PR Compare Link
Open `https://github.com/kalviumcommunity/Team-02/compare/main...feature/login-page-rbac` to review and merge!
