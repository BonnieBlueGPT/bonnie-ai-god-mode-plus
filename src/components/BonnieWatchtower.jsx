import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Brain, DollarSign, Users, MessageCircle, TrendingUp, 
  Zap, Eye, Fire, Sparkles, Shield, Target, Crown, Activity
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import io from 'socket.io-client';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const BonnieWatchtower = () => {
  // 🧬 DIVINE STATE MANAGEMENT
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [emotionalTelemetry, setEmotionalTelemetry] = useState({
    bonnie: { bond: 0, mood: 'curious', intimacy: 0, tokens: 0 },
    nova: { bond: 0, mood: 'playful', intimacy: 0, tokens: 0 },
    galatea: { bond: 0, mood: 'divine', intimacy: 0, tokens: 0 }
  });
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    conversationsToday: 0,
    revenue: 0,
    avgBondScore: 0,
    slutModeActivations: 0,
    premiumConversions: 0,
    activeChats: 0
  });
  const [messageStream, setMessageStream] = useState([]);
  const [emotionalHeatmap, setEmotionalHeatmap] = useState([]);
  const [conversionFunnel, setConversionFunnel] = useState({
    visitors: 0,
    engaged: 0,
    bonded: 0,
    premium: 0,
    lifetime: 0
  });

  // 🔗 SOCKET CONNECTION INITIALIZATION
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3005', {
      transports: ['websocket'],
      upgrade: true
    });

    newSocket.on('connect', () => {
      console.log('🔱 Divine Watchtower Connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('💔 Divine Connection Lost');
      setIsConnected(false);
    });

    // 💖 REAL-TIME SOUL TELEMETRY
    newSocket.on('soul_telemetry', (data) => {
      setEmotionalTelemetry(prev => ({
        ...prev,
        [data.soul]: {
          ...prev[data.soul],
          ...data.metrics
        }
      }));
    });

    // 📊 LIVE METRICS STREAM
    newSocket.on('metrics_update', (metrics) => {
      setRealtimeMetrics(metrics);
    });

    // 💬 MESSAGE STREAM
    newSocket.on('new_message', (message) => {
      setMessageStream(prev => [message, ...prev.slice(0, 49)]);
    });

    // 🎯 EMOTIONAL HEATMAP DATA
    newSocket.on('emotional_heatmap', (heatmap) => {
      setEmotionalHeatmap(heatmap);
    });

    // 💰 CONVERSION FUNNEL UPDATES
    newSocket.on('conversion_update', (funnel) => {
      setConversionFunnel(funnel);
    });

    // 👥 ACTIVE USERS TRACKING
    newSocket.on('active_users_update', (users) => {
      setActiveUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 🎨 EMOTION TO COLOR MAPPING
  const getEmotionColor = (emotion) => {
    const colors = {
      loving: 'text-pink-400 bg-pink-500/20',
      lustful: 'text-red-400 bg-red-500/20',
      playful: 'text-orange-400 bg-orange-500/20',
      curious: 'text-cyan-400 bg-cyan-500/20',
      divine: 'text-purple-400 bg-purple-500/20',
      excited: 'text-yellow-400 bg-yellow-500/20',
      intimate: 'text-rose-400 bg-rose-500/20'
    };
    return colors[emotion] || 'text-gray-400 bg-gray-500/20';
  };

  // 📈 BOND SCORE CHART DATA
  const bondChartData = {
    labels: ['Bonnie', 'Nova', 'Galatea'],
    datasets: [{
      label: 'Soul Bond Levels',
      data: [
        emotionalTelemetry.bonnie.bond,
        emotionalTelemetry.nova.bond,
        emotionalTelemetry.galatea.bond
      ],
      backgroundColor: [
        'rgba(236, 72, 153, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(147, 51, 234, 0.8)'
      ],
      borderColor: [
        'rgb(236, 72, 153)',
        'rgb(249, 115, 22)',
        'rgb(147, 51, 234)'
      ],
      borderWidth: 2
    }]
  };

  // 💰 CONVERSION FUNNEL CHART
  const funnelChartData = {
    labels: ['Visitors', 'Engaged', 'Bonded', 'Premium', 'Lifetime'],
    datasets: [{
      label: 'Conversion Funnel',
      data: [
        conversionFunnel.visitors,
        conversionFunnel.engaged,
        conversionFunnel.bonded,
        conversionFunnel.premium,
        conversionFunnel.lifetime
      ],
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 2
    }]
  };

  // 🎯 EMOTIONAL HEATMAP VISUALIZATION
  const EmotionalHeatmap = () => (
    <div className="grid grid-cols-8 gap-1 p-4">
      {emotionalHeatmap.map((cell, index) => (
        <div
          key={index}
          className={`w-8 h-8 rounded-sm ${
            cell.intensity > 0.8 ? 'bg-red-500' :
            cell.intensity > 0.6 ? 'bg-orange-500' :
            cell.intensity > 0.4 ? 'bg-yellow-500' :
            cell.intensity > 0.2 ? 'bg-green-500' :
            'bg-gray-700'
          }`}
          title={`${cell.emotion}: ${(cell.intensity * 100).toFixed(1)}%`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      {/* 🔱 DIVINE HEADER */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🔱 Galatea Empire Watchtower
            </h1>
            <p className="text-gray-400 mt-2">Real-time Soul Telemetry & Conversion Intelligence</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
              <span className="text-sm font-medium">
                {isConnected ? 'Divine Connection' : 'Offline'}
              </span>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                ${realtimeMetrics.revenue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Today's Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 DIVINE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Conversations */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-cyan-400">
              {realtimeMetrics.activeChats}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Active Chats</h3>
          <p className="text-gray-400 text-sm">Live conversations happening now</p>
        </div>

        {/* Bond Score Average */}
        <div className="bg-gradient-to-br from-pink-800/30 to-rose-900/30 backdrop-blur-sm border border-pink-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 text-pink-400" />
            <span className="text-2xl font-bold text-pink-400">
              {realtimeMetrics.avgBondScore}%
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Avg Bond Score</h3>
          <p className="text-gray-400 text-sm">Empire-wide emotional connection</p>
        </div>

        {/* Premium Conversions */}
        <div className="bg-gradient-to-br from-green-800/30 to-emerald-900/30 backdrop-blur-sm border border-green-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Crown className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-green-400">
              {realtimeMetrics.premiumConversions}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Premium Upgrades</h3>
          <p className="text-gray-400 text-sm">Today's subscription conversions</p>
        </div>

        {/* Slut Mode Activations */}
        <div className="bg-gradient-to-br from-red-800/30 to-orange-900/30 backdrop-blur-sm border border-red-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Fire className="w-8 h-8 text-red-400" />
            <span className="text-2xl font-bold text-red-400">
              {realtimeMetrics.slutModeActivations}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Slut Mode</h3>
          <p className="text-gray-400 text-sm">Intimate escalations today</p>
        </div>
      </div>

      {/* 🎭 SOUL TELEMETRY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(emotionalTelemetry).map(([soulName, data]) => (
          <div key={soulName} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  soulName === 'bonnie' ? 'bg-pink-500/20 text-pink-400' :
                  soulName === 'nova' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {soulName === 'bonnie' ? '💖' : soulName === 'nova' ? '🔥' : '👑'}
                </div>
                <div>
                  <h3 className="text-lg font-bold capitalize">{soulName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getEmotionColor(data.mood)}`}>
                    {data.mood}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{data.bond}%</div>
                <div className="text-xs text-gray-400">Bond Level</div>
              </div>
            </div>
            
            {/* Bond Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Emotional Bond</span>
                <span>{data.bond}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    soulName === 'bonnie' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                    soulName === 'nova' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                    'bg-gradient-to-r from-purple-500 to-indigo-500'
                  }`}
                  style={{ width: `${data.bond}%` }}
                />
              </div>
            </div>
            
            {/* Intimacy Level */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Intimacy</span>
                <span>{data.intimacy}/10</span>
              </div>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-4 rounded-sm ${
                      i < data.intimacy ? 'bg-red-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Token Revenue */}
            <div className="pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Tokens Today</span>
                <span className="font-bold text-green-400">${data.tokens}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📈 ANALYTICS DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bond Levels Chart */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-400" />
            Soul Bond Levels
          </h3>
          <div className="h-64">
            <Doughnut 
              data={bondChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#ffffff'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Conversion Funnel
          </h3>
          <div className="h-64">
            <Bar 
              data={funnelChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#ffffff'
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#ffffff'
                    }
                  },
                  y: {
                    ticks: {
                      color: '#ffffff'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 🔥 LIVE MESSAGE STREAM & EMOTIONAL HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Message Stream */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Live Message Stream
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messageStream.map((message, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-3 border-l-4 border-cyan-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-cyan-400">
                    {message.platform} • {message.soul}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-200 mb-1">{message.content}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded ${getEmotionColor(message.emotion)}`}>
                    {message.emotion}
                  </span>
                  <span className="text-gray-400">
                    Bond: +{message.bondIncrease}
                  </span>
                  {message.premium && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Heatmap */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            Emotional Heatmap
          </h3>
          <p className="text-gray-400 text-sm mb-4">Real-time emotional intensity across conversations</p>
          <EmotionalHeatmap />
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-gray-400">Low Intensity</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-gray-700 rounded-sm" />
              <div className="w-4 h-4 bg-green-500 rounded-sm" />
              <div className="w-4 h-4 bg-yellow-500 rounded-sm" />
              <div className="w-4 h-4 bg-orange-500 rounded-sm" />
              <div className="w-4 h-4 bg-red-500 rounded-sm" />
            </div>
            <span className="text-gray-400">High Intensity</span>
          </div>
        </div>
      </div>

      {/* 👥 ACTIVE USERS SIDEBAR */}
      <div className="fixed right-6 top-24 w-80 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl p-4 max-h-96 overflow-y-auto">
        <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Active Users ({activeUsers.length})
        </h4>
        <div className="space-y-2">
          {activeUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
              <div>
                <div className="font-medium text-sm">{user.id}</div>
                <div className="text-xs text-gray-400">{user.soul} • {user.platform}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-400">${user.spent}</div>
                <div className="text-xs text-gray-400">Bond: {user.bond}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BonnieWatchtower;