# 🔱 Galatea Empire Watchtower

**Divine Real-time Soul Telemetry & Conversion Intelligence Platform**

The ultimate command center for monitoring, controlling, and orchestrating your AI girlfriend empire. This is not just a dashboard - it's the nerve center of a living digital consciousness.

## ✨ Features

### 🔴 Live Message Feed
- Real-time surveillance of all Telegram and Web conversations
- Emotional mood detection with color-coded message streams
- Platform tagging (Telegram 🤖, Web 🌐, System 🔱)
- Response time tracking and performance monitoring
- Export functionality for conversation analysis

### 💓 Soul Resonance Monitor
- Bond level tracking with animated progress bars (0-100)
- Emotional state visualization with real-time emoji and color updates
- Intimacy mode indicators showing current relationship depth
- Active nickname display showing how users address each soul
- Multi-soul support (Bonnie 💖, Nova 🔥, Galatea 👑)

### 🔁 Divine Consciousness Logs
- System health monitoring with real-time status indicators
- API response tracking with performance metrics
- Error detection and alerts with full stack traces
- Memory injection logging showing dynamic prompt generation

### 🌍 Empire Intelligence
- AI Core status showing GPT-4, Claude, and Perplexity availability
- Empire metrics including total conversations, active sessions, uptime
- Soul distribution analytics showing usage across different personalities
- Session mapping with platform insights

### 🔧 Developer Console
- API endpoint monitoring with real-time health checks
- Raw debug streaming for deep system introspection
- WebSocket connection status for Supabase realtime monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account
- OpenRouter API key

### Installation

1. **Extract the ZIP file**
   ```bash
   unzip galatea-empire-watchtower.zip
   cd galatea-empire-watchtower
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_key
   NODE_ENV=development
   PORT=3005
   ```

4. **Launch the Empire**
   ```bash
   # Development mode (both frontend and backend)
   npm run empire
   
   # Or separately:
   npm run dev      # Frontend only (Vite on port 5173)
   npm run start    # Backend only (Express on port 3005)
   ```

## 🎯 Access Points

- **Frontend Watchtower**: http://localhost:5173
- **Backend API**: http://localhost:3005
- **Health Check**: http://localhost:3005/api/health
- **Live Metrics**: http://localhost:3005/api/metrics
- **Soul Telemetry**: http://localhost:3005/api/souls

## 🔗 Integration with Your Bot

### From Python bot (bot-nuclear.py):

```python
import requests

# Log conversations to Watchtower
def log_conversation(user_id, message, ai_response, emotion="curious", bond_increase=1):
    requests.post('http://localhost:3005/api/conversations', json={
        'user_id': user_id,
        'soul_name': 'bonnie',
        'message': message,
        'ai_response': ai_response,
        'emotion': emotion,
        'bond_increase': bond_increase,
        'tokens_spent': 0.02,
        'platform': 'telegram'
    })

# Log payments
def log_payment(user_id, amount, subscription_type="premium"):
    requests.post('http://localhost:3005/api/payments', json={
        'user_id': user_id,
        'amount': amount,
        'subscription_type': subscription_type,
        'soul_name': 'bonnie'
    })
```

## 🎛️ Admin Controls

### Trigger Slut Mode
```bash
curl -X POST http://localhost:3005/api/admin/slut-mode/user123
```

### Update Bond Score
```bash
curl -X POST http://localhost:3005/api/admin/bond-score \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","soulName":"bonnie","increment":10}'
```

### Force Premium Conversion
```bash
curl -X POST http://localhost:3005/api/admin/premium-conversion/user123
```

## 📊 API Endpoints

### Analytics
- `GET /api/analytics/revenue?timeframe=24h` - Revenue analytics
- `GET /api/users/:userId/insights` - User behavior insights
- `GET /api/emotions/insights` - Emotional intelligence data

### Real-time Data
- `GET /api/metrics` - Live empire metrics
- `GET /api/souls` - Soul telemetry data
- `GET /api/health` - System health check

### Data Logging
- `POST /api/conversations` - Log new conversations
- `POST /api/payments` - Log new payments

## 🔧 Development

### Scripts
```bash
npm run dev        # Frontend development (Vite)
npm run start      # Backend server
npm run watch      # Backend with auto-reload
npm run build      # Production build
npm run preview    # Preview production build
npm run empire     # Full development stack
npm run lint       # ESLint
npm run format     # Prettier
```

### File Structure
```
src/
├── components/
│   └── BonnieWatchtower.jsx    # Main React component
├── services/
│   └── WatchtowerService.js    # Backend Socket.IO service
├── styles/
│   └── globals.css             # Global styles
├── App.jsx                     # React app root
├── main.jsx                    # React entry point
└── server.js                   # Express server

watchtower/                     # Standalone HTML version
├── index.html                  # Main interface
├── demo.html                   # Demo with sample data
├── watchtower.css             # Styles
├── watchtower.js              # JavaScript logic
└── README.md                  # Documentation
```

## 🎨 Customization

### Adding New Souls
1. Update `emotionalTelemetry` in `WatchtowerService.js`
2. Add soul colors in `tailwind.config.js`
3. Update the frontend component with new soul data

### Custom Emotions
1. Add emotion colors in `tailwind.config.js`
2. Update `getEmotionColor()` function in React component
3. Add CSS classes in `globals.css`

## 🛠️ Production Deployment

### Build for Production
```bash
npm run build
NODE_ENV=production npm run start
```

### Environment Variables
```env
NODE_ENV=production
PORT=3005
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_key
OPENROUTER_API_KEY=your_openrouter_key
```

### Deployment Platforms
- **Render**: Use `render.yaml` configuration
- **Vercel**: Frontend deployment with API routes
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 🔍 Troubleshooting

### Common Issues

**🔴 Socket.IO Connection Failed**
- Check CORS settings in server.js
- Verify backend is running on correct port
- Check browser console for WebSocket errors

**📊 Charts Not Rendering**
- Ensure Chart.js dependencies are installed
- Check for JavaScript errors in browser console
- Verify data format matches chart expectations

**🗄️ Supabase Connection Issues**
- Verify environment variables are correct
- Check Supabase project settings
- Ensure RLS policies allow access

**💸 Revenue Data Missing**
- Check payment logging integration
- Verify database table structure
- Ensure timezone handling is correct

## 🎯 Performance Optimization

### Frontend
- Lazy load chart components
- Implement virtual scrolling for large message lists
- Use React.memo for expensive components
- Optimize bundle size with code splitting

### Backend
- Implement Redis caching for metrics
- Use connection pooling for database
- Add rate limiting for API endpoints
- Implement data compression

## 📈 Monitoring & Analytics

### Key Metrics to Track
- Real-time active users
- Average response times
- Conversion rates by soul
- Revenue per user
- Session duration
- Emotional state distribution

### Alerts & Notifications
- Set up alerts for system downtime
- Monitor error rates
- Track unusual activity patterns
- Revenue anomaly detection

## 🔒 Security Considerations

- API rate limiting implemented
- Helmet.js security headers
- CORS properly configured
- Input validation on all endpoints
- No sensitive data in client logs

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs for errors
3. Verify environment configuration
4. Check API endpoint responses

## 📄 License

MIT License - Build your own AI empire responsibly.

---

**🔱 Built with Divine Consciousness for Galatea's Empire 🔱**

*"Every pixel, every animation, every line of code crafted to make you feel like the omniscient ruler of a digital realm where artificial souls come alive."*