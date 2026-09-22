# Weekly Report Generator & Team Dashboard

## Setup Instructions

Follow these steps to set up and run the **Weekly Report Generator & Team Dashboard** application locally.

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git
* MongoDB or MongoDB Atlas

Verify Node.js and npm:

```bash
node --version
npm --version
```

---

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>

cd weekly-report-team-dashboard
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

---

## 3. Configure Environment Variables

The application requires separate `.env` files for the backend and frontend.

### Backend Environment

Create:

```text
backend/
└── .env
```

Add:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>/weekly-report
JWT_SECRET=your_secure_jwt_secret
PORT=5000
JWT_EXPIRES_IN=12h
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_email_app_password
# Production: use your deployed Vercel frontend URL
# Development: use http://localhost:3000
FRONTEND_URL=https://<YOUR_VERCEL_FRONTEND_DOMAIN>
SALT=samplevalue
# Set to "production" when deployed on production server
# For local development, remove it
NODE_ENV=production
```

### Backend Variables

| Variable         | Description                                |
| ---------------- | ------------------------------------------ |
| `MONGODB_URL`    | MongoDB Atlas connection string            |
| `JWT_SECRET`     | Secret used for JWT authentication         |
| `PORT`           | Backend server port                        |
| `JWT_EXPIRES_IN` | JWT token expiration time                  |
| `MAIL_USER`      | Email account used for email functionality |
| `MAIL_PASSWORD`  | Email app password                         |
| `FRONTEND_URL`   | Frontend URL allowed by the backend        |
| `SALT`           | Password hashing salt value                |

### Frontend Environment

Create:

```text
frontend/
└── .env
```

Add:

```env
# Production: use your deployed HTTPS backend URL
# Development: use http://localhost:5000
REACT_APP_API_URL=https://<YOUR_BACKEND_DOMAIN>```

This variable specifies the backend API URL used by the React application.

---

## 4. Configure MongoDB

The application uses **MongoDB** for data storage.

MongoDB Atlas can be used for the database.

Add your MongoDB Atlas connection string to:

```text
backend/.env
```

Example:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>/weekly-report
```

Before running the application, make sure:

* A MongoDB Atlas cluster has been created.
* A database user has been created.
* The database user has the required permissions.
* Your IP address is allowed under MongoDB **Network Access**.
* The database name is `weekly-report`.

The backend automatically connects to MongoDB using `MONGODB_URL`.

---

## 5. Seed the Database

If the project includes the seed script, run it from the backend directory:

```bash
cd backend

node seed
```

The seed script can populate the database with sample:

* Users
* Projects
* Weekly reports
* Tasks
* Report statuses
* Review information

---

## 6. Run the Application

The frontend and backend must be running in separate terminals.

### Start Backend

```bash
cd backend

npm run dev
```

The backend API will be available at:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd frontend

npm run start
```

The frontend will be available at:

```text
http://localhost:3000
```

---

## 7. Application URLs

| Component   | URL                     |
| ----------- | ----------------------- |
| Frontend    | `http://localhost:3000` |
| Backend API | `http://localhost:5000` |
| Database    | MongoDB Atlas           |

---

## Project Structure

```text
weekly-report-team-dashboard/
│
├── frontend/
│   ├── .env
│   ├── package.json
│   └── src/
│
├── backend/
│   ├── .env
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## Troubleshooting

### MongoDB Connection Error

Check the following:

* `MONGODB_URL` is correct.
* The MongoDB Atlas cluster is running.
* Database username and password are correct.
* Your IP address is allowed in MongoDB Atlas Network Access.
* The database user has the required permissions.

### Frontend Cannot Connect to Backend

Check that:

1. The backend server is running.
2. The backend is running on port `5000`.
3. `frontend/.env` contains:

```env
REACT_APP_API_URL=http://localhost:5000
```

4. `backend/.env` contains:

```env
FRONTEND_URL=http://localhost:3000
```

5. The frontend has been restarted after changing `.env` values.

### Environment Variables Not Working

Make sure the files are located correctly:

```text
weekly-report-team-dashboard/
│
├── frontend/
│   ├── .env
│   └── package.json
│
└── backend/
    ├── .env
    └── package.json
```

Restart the corresponding server after modifying environment variables.

---

## Security

Never commit real credentials to GitHub.

Do not include:

* MongoDB passwords
* JWT secrets
* Email passwords
* API keys
* Other private credentials

Add `.env` to `.gitignore`:

```text
.env
```

---

## Deployment Method

The application is deployed using **Vercel for the frontend** and **AWS EC2 for the backend**. Nginx acts as a reverse proxy, while DuckDNS provides the backend hostname and Let's Encrypt provides HTTPS.

### Deployment Architecture

```text
Vercel Frontend (HTTPS)
        ↓
DuckDNS Backend Domain (HTTPS)
        ↓
Nginx on AWS EC2
        ↓
Node.js / Express (:5000)
        ↓
MongoDB Atlas
```

### Deployment Prerequisites

Before deployment, ensure the following are available:

* GitHub repository
* Vercel account
* AWS account with an Ubuntu EC2 instance
* MongoDB Atlas database
* DuckDNS account
* Node.js, npm, PM2, and Nginx
* Certbot for HTTPS
* Required production environment variables

### Backend Deployment

Connect to the EC2 instance and clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd weekly-report-team-dashboard/backend
npm install
```

Configure the backend `.env` file with the required database, authentication, email, and frontend URL settings.

Start the backend with PM2:

```bash
pm2 start npm --name weekly-report-backend -- start
pm2 save
```

The Node.js server runs internally on:

```text
http://127.0.0.1:5000
```

### Nginx Configuration

Configure Nginx to forward requests to the Node.js server:

```nginx
server {
    listen 80;
    server_name <YOUR_BACKEND_DOMAIN>;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Test and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### DuckDNS and HTTPS

Create a DuckDNS hostname and point it to the EC2 public IP.

Install Certbot and configure Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d <YOUR_BACKEND_DOMAIN>
```

Enable HTTP-to-HTTPS redirection when prompted.

The backend will then be available through:

```text
https://<YOUR_BACKEND_DOMAIN>
```

### Frontend Deployment

Deploy the frontend to Vercel and configure:

```env
REACT_APP_API_URL=https://<YOUR_BACKEND_DOMAIN>
```

For the backend, configure:

```env
FRONTEND_URL=https://<YOUR_VERCEL_FRONTEND_DOMAIN>
```

Redeploy the frontend after updating the environment variable.

### AWS Security Group

Allow only the required ports:

| Port | Purpose |
| ---- | ------- |
| 22   | SSH     |
| 80   | HTTP    |
| 443  | HTTPS   |

Port `5000` should remain internal and does not need to be publicly exposed.

### Final Verification

Verify the backend and Nginx:

```bash
pm2 list
sudo nginx -t
curl -I https://<YOUR_BACKEND_DOMAIN>/
```

The frontend should communicate with the backend using HTTPS without Mixed Content errors.

## Live Application

The application is currently deployed and available for online access through the following link:


**Live Demo:** https://weekly-report-team-dashboard.vercel.app/

### Future Development

This application will continue to be improved and expanded in the future with additional features, enhancements, and improvements to provide a better team reporting and dashboard experience.
