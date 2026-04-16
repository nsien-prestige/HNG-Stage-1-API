# 🚀 Profile Intelligence Service API

<p align="center">
  <b>A smart backend service that transforms a simple name into structured, meaningful insights using multiple external APIs.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green" />
  <img src="https://img.shields.io/badge/Express.js-Framework-black" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green" />
  <img src="https://img.shields.io/badge/API-REST-blue" />
  <img src="https://img.shields.io/badge/Status-Live-success" />
</p>

---

## 📖 About The Project

The **Profile Intelligence Service** is a RESTful API that takes in a user's name and enriches it using multiple external data sources to generate structured profile insights.

It demonstrates real-world backend engineering concepts such as:

* Multi-API integration
* Data normalization and persistence
* Idempotent system design
* Scalable API architecture

---

## ✨ Key Features

* 🔗 **Multi-API Integration** (Gender, Age, Nationality)
* 🧠 **Data Processing & Classification**
* 💾 **Persistent Storage (MongoDB)**
* ♻️ **Idempotent Requests (No Duplicate Profiles)**
* 🔍 **Advanced Filtering**
* ⚡ **Clean & Consistent API Responses**
* 🛡️ **Robust Validation & Error Handling**

---

## 🌍 External Data Sources

| API         | Purpose              |
| ----------- | -------------------- |
| Genderize   | Predicts gender      |
| Agify       | Estimates age        |
| Nationalize | Predicts nationality |

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **HTTP Client:** Axios
* **ID Generation:** UUID v7

---

## 🔗 Live API

```id="apiurl1"
https://hng-stage-1.hostless.app/api/profiles
```

---

## ⚡ How It Works

1. User submits a name
2. System calls 3 external APIs in parallel
3. Data is processed and normalized
4. Result is stored in the database
5. Clean JSON response is returned

---

## 📂 API Endpoints

### ➤ Create Profile

**POST** `/api/profiles`

```json id="ex1"
{
  "name": "ella"
}
```

✔️ Aggregates data from all APIs
✔️ Stores processed result
✔️ Prevents duplicate entries

---

### ➤ Get All Profiles

**GET** `/api/profiles`

Supports filtering:

```id="ex2"
/api/profiles?gender=male&country_id=NG&age_group=adult
```

---

### ➤ Get Profile by ID

**GET** `/api/profiles/:id`

---

### ➤ Delete Profile

**DELETE** `/api/profiles/:id`

---

## 🧠 Data Processing Logic

* **Age Groups**

  * 0–12 → child
  * 13–19 → teenager
  * 20–59 → adult
  * 60+ → senior

* **Nationality**

  * Selected based on highest probability

* **Gender**

  * Includes probability + sample size

---

## ❗ Error Handling

All errors follow a consistent format:

```json id="err1"
{
  "status": "error",
  "message": "Description of error"
}
```

### Common Cases

* `400` → Missing name
* `422` → Invalid input
* `404` → Not found
* `502` → External API failure
* `500` → Server error

---

## 🧪 Edge Case Handling

* Invalid Genderize response → rejected
* Missing age data → rejected
* No nationality data → rejected

---

## 🔐 CORS

```id="cors1"
Access-Control-Allow-Origin: *
```

---

## 🧑‍💻 Getting Started

### Clone the Repository

```bash id="cmd1"
git clone https://github.com/nsien-prestige/HNG-Stage-1-API.git
cd HNG-Stage-1-API
```

### Install Dependencies

```bash id="cmd2"
npm install
```

### Setup Environment Variables

```env id="env1"
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

### Run the Server

```bash id="cmd3"
npm start
```

---

## 📁 Project Structure

```id="tree1"
.
├── db.js
├── index.js
├── router.js
├── model.js
├── package.json
└── .env
```

---

## 🎯 What This Project Demonstrates

* Clean API design
* Real-world backend architecture
* Handling third-party dependencies
* Writing production-ready logic
* Defensive programming & validation

---

## 📌 Submission Info

* **Repository:** https://github.com/nsien-prestige/HNG-Stage-1-API
* **Live API:** https://hng-stage-1.hostless.app/api/profiles

---

## 👨‍💻 Author

**Prestige Nsien**

---

## ⭐ Final Note

This project reflects a strong foundation in backend engineering principles, focusing on reliability, scalability, and clean architecture.

---
