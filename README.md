# 🚀 JobTracker – Smart Job Application Manager

A modern **full-stack MERN application** that helps you track, organize, and manage your job applications efficiently using a clean dashboard and Kanban-style workflow.

---

## 🌐 Live Demo

* 🔗 **Frontend:** https://job-tracker-eight-theta.vercel.app/
* 🔗 **Backend API:** https://jobtracker-backend-z58z.onrender.com

---

## 📌 Features

### 🔐 Authentication

* Secure user signup & login (JWT-based)
* Protected routes & API access

### 📊 Dashboard Overview

* Real-time job tracking dashboard
* Stage-wise statistics (Applied, Screening, Interview, Offer, Rejected)

### 🗂 Job Management

* Add, edit, delete job applications
* Track detailed information:

  * Company
  * Role
  * Status
  * Location
  * Salary
  * Notes
  * Application link

### 🧲 Drag & Drop (Kanban Board)

* Move jobs between stages:

  ```
  Applied → Screening → Interview → Offer → Rejected
  ```
* Instant UI + backend sync

### 🎨 UI/UX

* Clean and modern SaaS-style UI
* Fully responsive design
* Built with Tailwind CSS

---

## 🛠 Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios
* React Router
* Drag & Drop (dnd-kit)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AbhishekKale97/JOB_TRACKER.git
cd JOB_TRACKER
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env`:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
JOB_TRACKER/
│
├── frontend/        # React (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│
├── server/          # Express API
│   ├── routes/
│   ├── models/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## 🚀 Deployment

### Backend (Render)

* Root Directory: `server`
* Environment Variables:

  * `MONGO_URI`
  * `JWT_SECRET`
  * `CLIENT_URL`

### Frontend (Vercel)

* Root Directory: `frontend`
* Environment Variable:

  * `VITE_API_URL`

---

## ⚠️ Common Issues

* **CORS Error** → Check `CLIENT_URL` in backend
* **400 Bad Request** → Status must be:

  ```
  applied, screening, interview, offer, rejected
  ```
* **401 Unauthorized** → Token missing or invalid

---

## 📈 Future Improvements

* Notifications & reminders
* Resume upload feature
* Analytics dashboard
* AI-based job recommendations

---

## 👨‍💻 Author

**Abhishek Kale**

---

## ⭐ Show Your Support

If you like this project:

* ⭐ Star this repo
* 🍴 Fork it
* 🛠 Contribute

---

## 📜 License

This project is licensed under the MIT License.
