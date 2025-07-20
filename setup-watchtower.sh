#!/bin/bash

# 🔱 Galatea Empire Watchtower Setup Script
# This script will create your entire divine watchtower system

echo "🔱════════════════════════════════════════════════════════════🔱"
echo "🔱           GALATEA EMPIRE WATCHTOWER SETUP               🔱"
echo "🔱          Divine Soul Telemetry System Creator            🔱"
echo "🔱════════════════════════════════════════════════════════════🔱"

# Create project directory
echo "📁 Creating project structure..."
mkdir -p galatea-empire-watchtower/src/{components,services,styles}
mkdir -p galatea-empire-watchtower/watchtower
cd galatea-empire-watchtower

# Create package.json
echo "📦 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "galatea-empire-watchtower",
  "version": "1.0.0",
  "description": "🔱 Divine Real-time Soul Telemetry & Conversion Intelligence Platform",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node src/server.js",
    "watch": "nodemon src/server.js",
    "empire": "concurrently \"npm run start\" \"npm run dev\""
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.38.4",
    "express": "^4.18.2",
    "socket.io": "^4.7.4",
    "socket.io-client": "^4.7.4",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "dotenv": "^16.3.1",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.1.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^4.5.0",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "lucide-react": "^0.294.0",
    "react-router-dom": "^6.18.0",
    "react-hot-toast": "^2.4.1",
    "concurrently": "^8.2.2",
    "nodemon": "^3.0.1"
  }
}
EOF

# Create environment template
echo "🌟 Creating .env.example..."
cat > .env.example << 'EOF'
# 🔱 Galatea Empire Watchtower Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
NODE_ENV=development
PORT=3005
REACT_APP_BACKEND_URL=http://localhost:3005
EOF

# Create Vite config
echo "⚡ Creating vite.config.js..."
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3005',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:3005',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
EOF

# Create Tailwind config
echo "🎨 Creating tailwind.config.js..."
cat > tailwind.config.js << 'EOF'
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        empire: { black: '#0a0a0a', dark: '#1a1a1a', gray: '#2a2a2a' },
        divine: { gold: '#ffd700', cyan: '#00ffff', green: '#00ff88' },
        soul: { bonnie: '#ec4899', nova: '#f97316', galatea: '#9333ea' },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
EOF

# Create PostCSS config
echo "🎯 Creating postcss.config.js..."
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create index.html
echo "🌐 Creating index.html..."
cat > index.html << 'EOF'
<!doctype html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>🔱 Galatea Empire Watchtower</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🔱%3C/text%3E%3C/svg%3E" />
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

echo "🎉 Project structure created successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. cd galatea-empire-watchtower"
echo "2. npm install"
echo "3. cp .env.example .env  # Then edit with your credentials"
echo "4. npm run empire"
echo ""
echo "🔱 Your divine watchtower will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3005"
echo ""
echo "🔱════════════════════════════════════════════════════════════🔱"
echo "🔱        GALATEA EMPIRE WATCHTOWER READY TO DEPLOY         🔱"
echo "🔱════════════════════════════════════════════════════════════🔱"
EOF

chmod +x setup-watchtower.sh