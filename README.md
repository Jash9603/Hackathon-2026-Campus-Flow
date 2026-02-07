# 🌟 Campus Flow

> **An AI-Powered Campus Event Management Platform**  
> Built with the spirit of *Stranger Things* - Making event management feel like magic, not the Upside Down.

![Tech Stack](https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Groq%20Llama-00FFFF?style=for-the-badge)
![WebSockets](https://img.shields.io/badge/Real--Time-Socket.io-010101?style=for-the-badge)

---

## 🎯 The Problem

Campus event management is currently **fragmented and inefficient**:

- 📅 **Event Discovery**: Students miss out on events due to poor visibility and scattered information
- 🤝 **Registration Friction**: Complex registration processes discourage participation
- 🔧 **Inflexibility**: One-size-fits-all platforms don't adapt to different event types (hackathons, workshops, seminars)
- 📊 **Poor Analytics**: Organizers lack real-time insights and engagement metrics
- 💬 **Zero Personalization**: No intelligent assistance for event queries or registration

**Impact**: Low event turnout, wasted organizational effort, and missed opportunities for student engagement.

---

## ✨ Our Solution

**Campus Flow** is a **modular, AI-powered platform** that transforms campus event management:

### 🧩 Modular Event System
Each event can enable/configure only what it needs:
- **Registration Module** - Custom forms, capacity limits, waitlists
- **Voting Module** - Polls, Q&A, feedback collection
- **Schedule Module** - Multi-day timelines, session tracking
- **Custom Theming** - Brand-specific colors and styling

### 🤖 AI Concierge: "Hawkins"
Powered by **Groq Llama 3.3 70B**, the chatbot provides:
- Natural language event discovery
- **One-click registration** via chat ("Register me for Hackathon 2026")
- Contextual event recommendations
- Real-time event updates

### 🎨 Immersive UI/UX
*Stranger Things*-inspired design with:
- Custom cursor effects and particle animations
- Branching thunder effects
- CRT screen overlays and scanlines
- Glassmorphic cards with neon accents

### ⚡ Real-Time Features
- Live event updates via **Socket.io**
- Instant registration confirmations
- Dynamic capacity tracking

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Fast build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Axios** | API communication |
| **Socket.io Client** | Real-time updates |
| **Lucide React** | Modern icon library |

### **Backend**
| Technology | Purpose |
|------------|---------|
| **Node.js + Express.js** | RESTful API server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Secure authentication |
| **Socket.io** | WebSocket server |
| **Groq SDK** | AI model integration |
| **Nodemailer** | Email notifications |
| **Bcrypt.js** | Password hashing |

### **AI & Infrastructure**
| Technology | Purpose |
|------------|---------|
| **Groq Llama 3.3 70B** | AI conversational engine |
| **MongoDB Atlas** | Cloud database |
| **Environment Variables** | Secure config management |

---

## 🚀 Key Features

### For Students
- 🔍 **Smart Event Discovery** - Browse events with filters and AI assistance
- 💬 **Chat-Based Registration** - Register for events by simply asking the AI
- 📱 **Responsive Design** - Seamless experience on mobile and desktop
- 🔔 **Notifications** - Real-time updates on event changes
- 👤 **User Profiles** - Track registrations and event history

### For Organizers
- 🎨 **Event Customization** - Dynamic modules, themes, and configurations
- 📊 **Dashboard Analytics** - Real-time registration tracking
- ✅ **Registration Management** - Approve, reject, or update attendee status
- 🗳️ **Voting & Polls** - Collect feedback and decisions
- 📧 **Email Integration** - Automated confirmations and reminders

### For Admins
- 🛡️ **Role-Based Access** - Student, Organizer, Admin permissions
- 🏗️ **Event Oversight** - Manage all campus events from one dashboard
- 📈 **Platform Analytics** - Track engagement metrics

---

## 🎨 Visual Effects

Our *Stranger Things* theme brings events to life:

✨ **Custom Cursor** - Glowing trail effect  
⚡ **Thunder Animation** - Realistic branching lightning  
🌌 **Particle Background** - Connected network effect  
📐 **3D Perspective Grid** - Tron-style animated grid  
💫 **Floating Orbs** - Pulsing energy spheres  
🖥️ **CRT Effects** - Retro scanlines and overlays  

---

## 📂 Project Structure

```
Hackathon 2026/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation
│   │   ├── config/         # Database connection
│   │   └── utils/          # Email, helpers
│   ├── .env               # Environment variables
│   └── server.js          # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── context/       # React Context (Auth, Notifications)
│   │   ├── utils/         # API config
│   │   └── App.jsx        # Main app component
│   ├── public/            # Static assets
│   └── index.html         # HTML template
│
└── .gitignore             # Git ignore rules
```

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)
- Groq API Key ([Get one here](https://console.groq.com))

### 1. Clone Repository
```bash
git clone <repository-url>
cd "Hackathon 2026"
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOL
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EOL

# Create admin account (run once)
npm run seed:admin

npm run dev
```

**📧 Default Admin Credentials:**
- **Email**: `admin@campus.com`
- **Password**: `admin123`

> ⚠️ **Security Note**: Only ONE admin account exists. Users can only register as student or organizer. Admin registration is blocked for security.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 🔐 Environment Variables

### Backend `.env`
```bash
MONGO_URI=mongodb+srv://...        # MongoDB connection string
JWT_SECRET=your_secret_key         # JWT signing key
GROQ_API_KEY=gsk_...              # Groq API key for AI
EMAIL_USER=your_email@gmail.com    # Email service
EMAIL_PASS=your_app_password       # Email password
PORT=5000                          # Server port (optional)
```

---

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event (Organizer)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (Organizer)
- `DELETE /api/events/:id` - Delete event (Organizer)

### Registrations
- `POST /api/registrations/:eventId` - Register for event
- `GET /api/registrations/my` - Get user's registrations
- `GET /api/registrations/event/:eventId` - Get event registrations
- `PUT /api/registrations/:id` - Update registration status

### AI Chatbot
- `POST /api/ai/chat` - Chat with Hawkins AI

### Voting
- `POST /api/votes/:eventId` - Cast/update vote
- `GET /api/votes/event/:eventId` - Get event votes

---

## 🎭 User Roles

| Role | Permissions |
|------|-------------|
| **Student** | Browse events, register, vote, chat with AI |
| **Organizer** | All student permissions + create/manage own events |
| **Admin** | All organizer permissions + manage all events + user management |

**Note:** Admins automatically have organizer privileges, so any route that requires organizer access also works for admins.

---

## 🤝 Contributing

This is a hackathon project, but we welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is built for educational and hackathon purposes.

---

## 👥 Team

Built with ❤️ by the Campus Flow Team

---

## 🙏 Acknowledgments

- **Groq** for lightning-fast AI inference
- **MongoDB** for flexible data storage
- **Netflix** for *Stranger Things* inspiration
- The open-source community for amazing tools

---

**Made with 🔥 for Hackathon 2026**
