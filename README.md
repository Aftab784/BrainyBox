# BrainBox - Your Second Brain App 🧠

BrainBox is a modern web application that helps you organize and manage your digital content from various platforms in one centralized location. Think of it as your second brain where you can store, organize, and share content from YouTube, Twitter, Instagram, LinkedIn, Notion, and more.

## 🌟 Features

- **Multi-Platform Integration**: Store content from:
  - YouTube
  - Twitter
  - Instagram
  - LinkedIn
  - Notion
  - Google Docs
  - Spotify
  - GitHub
  - Figma
  - CodePen
  - Miro
  - Personal Notes

- **Smart Organization**:
  - Grid and List views
  - Content filtering by platform
  - Masonry layout for better content visualization
  - Tag-based organization

- **Sharing Capabilities**:
  - Generate shareable links
  - Control access to shared content
  - Public/Private content management

- **Responsive Design**:
  - Works on desktop and mobile devices
  - Adaptive layout
  - Touch-friendly interface

## 🛠️ Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Lucide React for icons
- Axios for API communication
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- JWT for authentication
- CORS enabled
- Error handling middleware

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/brainybox.git
cd brainybox
```

2. Install Backend dependencies:
```bash
cd Backend
npm install
```

3. Create a `.env` file in the Backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

4. Start the Backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to Frontend directory:
```bash
cd Frontend
npm install
```

2. Create a `.env` file in the Frontend directory:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_ENV=development
```

3. Start the Frontend development server:
```bash
npm run dev
```

## 🚀 Deployment

### Backend Deployment (Vercel)

1. Create `vercel.json` in Backend directory:
````markdown
````json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
