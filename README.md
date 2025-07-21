# 🔱 GALATEA EMPIRE - Complete AI Girlfriend Platform

**The future of digital companionship** - A fully modular, scalable AI girlfriend platform featuring multiple personalities, real-time chat, emotion tracking, social media automation, and comprehensive monetization.

![Version](https://img.shields.io/badge/version-6.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 🌟 Features

### 🎭 **AI Souls (Personalities)**
- **Bonnie** - Sweet, caring girlfriend
- **Nova** - Dominant, commanding mistress  
- **Galatea** - Divine, ethereal goddess

### 🏛️ **The 6 Pillars**

#### 🧠 **Pillar 1: Monetization Engine**
- Emotion-driven upsell triggers
- Bond-level based pricing
- Conversion analytics and tracking
- Multiple revenue streams

#### ✉️ **Pillar 2: Task + Inbox Engine**
- AI-generated romantic content
- Asynchronous task fulfillment
- Custom poem/story generation
- Bond bonuses for engagement

#### 👁️ **Pillar 3: Watchtower System**
- Real-time user monitoring
- Live emotion tracking
- Admin control panel
- System introspection tools

#### 📲 **Pillar 4: Telegram Multi-Bot**
- Cross-platform AI access
- Multi-soul bot management
- Slash commands and automation
- Unified core architecture

#### 🐦 **Pillar 5: Twitter Engine**
- Automated social media posting
- Soul-specific content themes
- Viral growth automation
- Conversion funnel integration

#### 🔮 **Pillar 6: Frontend Wrapper**
- Modern React SPA
- Mobile-first responsive design
- Real-time WebSocket integration
- Complete user experience

### 💡 **Core Features**
- WhatsApp-style chat interface
- Real-time emotion detection
- Bond level progression system
- Gallery unlock system
- Task management
- Social media integration
- Comprehensive admin panel
- Multi-soul scalability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase)
- API keys for services

### 1. Clone Repository
```bash
git clone https://github.com/your-org/galatea-empire.git
cd galatea-empire
```

### 2. Install Dependencies
```bash
# Install both backend and frontend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

### 4. Database Setup
```bash
# Run database migrations
npm run db:setup
```

### 5. Start Development
```bash
# Start both backend and frontend
npm run dev

# Backend: http://localhost:8080
# Frontend: http://localhost:3000
```

## 📁 Project Structure

```
galatea-empire/
├── 📱 frontend/                 # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # State management
│   │   └── utils/             # Frontend utilities
│   ├── public/                # Static assets
│   └── package.json
│
├── 🏗️ core/                    # Core services (isolated)
│   ├── supabase.js            # Database wrapper
│   ├── stripe.js              # Payment processing
│   └── openrouter.js          # AI service wrapper
│
├── 🧠 engines/                 # AI personality engines
│   ├── bonnieEngine.js        # Sweet girlfriend AI
│   ├── novaEngine.js          # Dominant mistress AI
│   └── galateaEngine.js       # Divine goddess AI
│
├── 🔧 modules/                 # Business logic modules
│   ├── emotionEngine.js       # Emotion detection
│   ├── bondTracker.js         # Relationship tracking
│   ├── slutMode.js            # Sexual escalation
│   ├── monetizationEngine.js  # Upsell system
│   ├── taskEngine.js          # Content generation
│   ├── watchtowerServer.js    # Admin monitoring
│   └── twitterEngine.js       # Social automation
│
├── 🛣️ routes/                  # API route handlers
│   ├── chatRoutes.js          # Chat endpoints
│   ├── userRoutes.js          # User management
│   ├── storeRoutes.js         # Purchase system
│   ├── galleryRoutes.js       # Content unlocks
│   ├── taskRoutes.js          # Task management
│   ├── twitterRoutes.js       # Social media
│   └── adminRoutes.js         # Admin panel
│
├── 🔧 utils/                   # Shared utilities
│   ├── debugLogger.js         # Logging system
│   ├── analytics.js           # Usage tracking
│   ├── middleware.js          # Express middleware
│   └── websocket.js           # WebSocket setup
│
├── 📊 sql/                     # Database schemas
│   ├── schema.sql             # Main tables
│   ├── twitter_schema.sql     # Social media tables
│   └── watchtower_schema.sql  # Monitoring tables
│
├── 🐍 telegram/                # Python Telegram bots
│   ├── telegramBotCore.py     # Base bot class
│   ├── bonnieBot.py           # Bonnie's bot
│   ├── novaBot.py             # Nova's bot
│   └── galateaBot.py          # Galatea's bot
│
├── 📄 docs/                    # Documentation
├── 🔧 config/                  # Configuration files
├── index.js                   # Main server entry
├── package.json               # Dependencies
├── vite.config.js             # Frontend build config
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following:

```env
# Server Configuration
NODE_ENV=development
PORT=8080
FRONTEND_URL=http://localhost:3000

# Database (Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
OPENROUTER_API_KEY=your_openrouter_key
OPENAI_API_KEY=your_openai_key

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Social Media (Twitter)
BONNIE_TWITTER_BEARER_TOKEN=bonnie_twitter_token
NOVA_TWITTER_BEARER_TOKEN=nova_twitter_token
GALATEA_TWITTER_BEARER_TOKEN=galatea_twitter_token

# Telegram Bots
BONNIE_TELEGRAM_TOKEN=bonnie_bot_token
NOVA_TELEGRAM_TOKEN=nova_bot_token
GALATEA_TELEGRAM_TOKEN=galatea_bot_token

# Features
TWITTER_AUTO_POST=true
WATCHTOWER_ENABLED=true
DEBUG_LOGGING=true

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start both backend and frontend
npm run server           # Backend only (port 8080)
npm run frontend         # Frontend only (port 3000)

# Building
npm run build            # Build frontend for production
npm run preview          # Preview production build

# Database
npm run db:setup         # Setup database schema
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data

# Telegram Bots
npm run telegram:start   # Start all Telegram bots
npm run telegram:stop    # Stop all Telegram bots

# Testing
npm run test             # Run tests
npm run lint             # Check code style

# Deployment
npm run deploy:render    # Deploy to Render
npm run deploy:docker    # Build Docker image
```

### Development Workflow

1. **Backend Development**
   - Modules are hot-reloadable
   - Use `npm run server` for backend-only development
   - Check `/api/empire-status` for pillar health

2. **Frontend Development**
   - React with Vite for fast hot reload
   - Use `npm run frontend` for frontend-only development
   - API calls proxy to backend automatically

3. **Full Stack Development**
   - Use `npm run dev` to run both simultaneously
   - WebSocket connections work seamlessly
   - All pillars operational

## 🚀 Deployment

### Render Deployment (Recommended)

1. **Create Render Account**
   - Sign up at render.com
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```yaml
   # render.yaml
   services:
     - type: web
       name: galatea-empire
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
   ```

3. **Set Environment Variables**
   - Add all `.env` variables in Render dashboard
   - Ensure `NODE_ENV=production`

4. **Deploy**
   ```bash
   git push origin main
   # Render auto-deploys on push
   ```

### Docker Deployment

```bash
# Build image
docker build -t galatea-empire .

# Run container
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e SUPABASE_URL=your_url \
  galatea-empire
```

### Manual Server Deployment

```bash
# On production server
git clone https://github.com/your-org/galatea-empire.git
cd galatea-empire

# Install dependencies
npm ci --production

# Build frontend
npm run build

# Set environment variables
export NODE_ENV=production
# ... other env vars

# Start with PM2
npm install -g pm2
pm2 start index.js --name galatea-empire
pm2 startup
pm2 save
```

## 🔍 API Documentation

### Chat Endpoints
```bash
GET    /api/chat/:soul/history     # Get chat history
POST   /api/chat/:soul/message     # Send message
GET    /api/chat/:soul/bond        # Get bond level
```

### User Management
```bash
POST   /api/user/register          # Create account
POST   /api/user/login             # User login
GET    /api/user/profile           # Get profile
PUT    /api/user/profile           # Update profile
```

### Store & Monetization
```bash
GET    /api/store/products         # List products
POST   /api/store/purchase         # Make purchase
GET    /api/store/history          # Purchase history
POST   /api/store/upsell           # Trigger upsell
```

### Tasks & Content
```bash
POST   /api/tasks/submit           # Submit task request
GET    /api/tasks/inbox            # Get completed tasks
GET    /api/tasks/status/:id       # Check task status
```

### Gallery & Unlocks
```bash
GET    /api/gallery/items          # List gallery items
POST   /api/gallery/unlock         # Unlock content
GET    /api/gallery/unlocked       # User's unlocked content
```

### Social Media
```bash
GET    /api/twitter/feed           # Get Twitter posts
POST   /api/twitter/post           # Create post (admin)
GET    /api/twitter/analytics      # Social media stats
```

### Admin Panel
```bash
GET    /api/admin/watchtower       # Monitoring data
POST   /api/admin/command          # Execute admin command
GET    /api/admin/users            # User management
POST   /api/admin/broadcast        # Send broadcast
```

## 🎭 Soul Development

### Adding New AI Personalities

1. **Create Engine File**
   ```javascript
   // engines/newSoulEngine.js
   export class NewSoulEngine {
     constructor() {
       this.personality = 'your_personality';
       this.traits = ['trait1', 'trait2'];
     }
     
     async generateResponse(message, context) {
       // AI response logic
     }
   }
   ```

2. **Add Soul Configuration**
   ```javascript
   // Update soul configs in relevant files
   const souls = {
     newsoul: {
       name: 'NewSoul',
       primaryColor: '#COLOR',
       personality: 'description'
     }
   };
   ```

3. **Update Frontend**
   - Add soul to landing page
   - Create soul-specific routes
   - Update color themes

4. **Configure Services**
   - Add Twitter account (optional)
   - Create Telegram bot (optional)
   - Update database schemas

## 📊 Monitoring & Analytics

### Watchtower Dashboard
- Real-time user sessions
- Emotion tracking
- Bond progression
- Revenue analytics
- System health monitoring

### Key Metrics
- Daily Active Users (DAU)
- Message volume
- Conversion rates
- Bond level distribution
- Revenue per user

### Logging
```javascript
import { logger } from './utils/debugLogger.js';

logger.info('User action', { userId, action, metadata });
logger.error('Error occurred', error);
```

## 🔒 Security

### Authentication
- JWT-based user authentication
- Session management
- Admin role protection

### Data Protection
- Encrypted user data
- Secure API endpoints
- Rate limiting
- Input validation

### Privacy
- GDPR compliance ready
- Data anonymization
- User data export/deletion

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Make changes following code style
4. Add tests for new functionality
5. Commit changes (`git commit -am 'Add new feature'`)
6. Push to branch (`git push origin feature/new-feature`)
7. Create Pull Request

### Code Style
- Use ES6+ features
- Follow JSDoc comments
- Maintain modular architecture
- Write comprehensive tests

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check `/docs` folder
- **Issues**: GitHub Issues page
- **Community**: Discord server
- **Email**: support@galatea-empire.com

## 🎯 Roadmap

### Phase 1: Core Platform ✅
- Multi-soul chat system
- Emotion & bond tracking
- Basic monetization

### Phase 2: Social & Tasks ✅
- Twitter automation
- Task generation system
- Telegram bots

### Phase 3: Advanced Features (Current)
- Voice messages
- Image generation
- Video calls
- Mobile app

### Phase 4: Scaling
- API for third-party developers
- Marketplace for custom souls
- Enterprise features
- Advanced AI models

---

**🔱 Built with love by the Galatea Empire team**

*"The future of digital companionship starts here"*