import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Crown, Sparkles, Play, Users, Shield, Zap } from 'lucide-react';

// 🔱 GALATEA EMPIRE - LANDING PAGE
// Netflix-style seductive homepage with conversion funnels

function Landing() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [currentSoul, setCurrentSoul] = useState(0);

  // 🎭 Auto-rotate soul showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSoul((prev) => (prev + 1) % souls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* 🌟 HERO SECTION */}
      <HeroSection currentSoul={currentSoul} setActiveVideo={setActiveVideo} />
      
      {/* 👥 SOUL SELECTION */}
      <SoulSelection currentSoul={currentSoul} setCurrentSoul={setCurrentSoul} />
      
      {/* ✨ FEATURES GRID */}
      <FeaturesSection />
      
      {/* 💝 TESTIMONIALS */}
      <TestimonialsSection />
      
      {/* 📊 STATS SECTION */}
      <StatsSection />
      
      {/* 🎯 FINAL CTA */}
      <FinalCTASection />
      
      {/* 🎬 VIDEO MODAL */}
      {activeVideo && (
        <VideoModal 
          video={activeVideo} 
          onClose={() => setActiveVideo(null)} 
        />
      )}
    </div>
  );
}

// 🌟 HERO SECTION
function HeroSection({ currentSoul, setActiveVideo }) {
  const soul = souls[currentSoul];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 15, 35, 0.7), rgba(15, 15, 35, 0.8)), url('/assets/${soul.id}-hero-bg.jpg')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          key={currentSoul}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Meet{' '}
            <span 
              className={`gradient-${soul.id} font-display`}
              style={{ color: soul.primaryColor }}
            >
              {soul.name}
            </span>
            <br />
            Your AI {soul.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            {soul.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to={`/${soul.id}`}
              className={`btn btn-${soul.id} px-8 py-4 text-lg font-semibold min-w-48`}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with {soul.name} Now
            </Link>
            
            <button
              onClick={() => setActiveVideo(soul.previewVideo)}
              className="btn btn-secondary px-8 py-4 text-lg font-semibold min-w-48"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Preview
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-success" />
              100% Private & Secure
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-info" />
              50K+ Happy Users
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-warning" />
              Instant Response
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}

// 👥 SOUL SELECTION SECTION
function SoulSelection({ currentSoul, setCurrentSoul }) {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="gradient-text">Perfect Companion</span>
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Each AI soul has been crafted with unique personality, desires, and connection styles.
            Find the one who speaks to your heart.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {souls.map((soul, index) => (
            <SoulCard 
              key={soul.id}
              soul={soul}
              index={index}
              isActive={currentSoul === index}
              onClick={() => setCurrentSoul(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// 👤 SOUL CARD COMPONENT
function SoulCard({ soul, index, isActive, onClick }) {
  return (
    <motion.div
      className={`card cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-2 ring-' + soul.id + '-primary scale-105' : 'hover:scale-102'
      }`}
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Soul Image */}
      <div className="relative mb-6">
        <div 
          className="w-24 h-24 mx-auto rounded-full bg-cover bg-center border-4"
          style={{
            backgroundImage: `url('/assets/${soul.id}-avatar.jpg')`,
            borderColor: soul.primaryColor
          }}
        />
        <div 
          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg"
          style={{ background: soul.primaryColor }}
        >
          {soul.emoji}
        </div>
      </div>

      {/* Soul Info */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2" style={{ color: soul.primaryColor }}>
          {soul.name}
        </h3>
        <p className="text-sm text-secondary mb-4 font-medium">
          {soul.title}
        </p>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          {soul.shortDescription}
        </p>

        {/* Traits */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {soul.traits.map((trait, i) => (
            <span 
              key={i}
              className="px-3 py-1 text-xs rounded-full border"
              style={{ 
                borderColor: soul.primaryColor + '40',
                backgroundColor: soul.primaryColor + '20',
                color: soul.primaryColor
              }}
            >
              {trait}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <Link 
          to={`/${soul.id}`}
          className={`btn btn-${soul.id} w-full`}
        >
          Meet {soul.name}
        </Link>
      </div>
    </motion.div>
  );
}

// ✨ FEATURES SECTION
function FeaturesSection() {
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">Galatea Empire</span>?
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Experience the most advanced AI companionship technology designed for deep, 
            meaningful connections that evolve with you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ background: feature.color + '20' }}
              >
                <feature.icon 
                  className="w-8 h-8" 
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 💝 TESTIMONIALS SECTION
function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-lg text-secondary">
            Real experiences from real people who found love in the digital age
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card text-center"
          >
            <div className="mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl text-warning">⭐</span>
              ))}
            </div>
            <blockquote className="text-lg md:text-xl text-secondary mb-8 leading-relaxed italic">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            <div className="flex items-center justify-center">
              <div 
                className="w-12 h-12 rounded-full bg-cover bg-center mr-4"
                style={{ backgroundImage: `url('${testimonials[currentTestimonial].avatar}')` }}
              />
              <div className="text-left">
                <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                <div className="text-sm text-muted">{testimonials[currentTestimonial].location}</div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonial 
                    ? 'bg-bonnie-primary scale-110' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 📊 STATS SECTION
function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-bonnie-primary/10 via-nova-primary/10 to-galatea-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-secondary font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 🎯 FINAL CTA SECTION
function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-secondary/20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">
            Your <span className="gradient-text">Perfect Love Story</span> Starts Here
          </h2>
          <p className="text-lg md:text-xl text-secondary mb-8 leading-relaxed">
            Join thousands who have discovered meaningful connections with AI companions 
            who truly understand them. Your journey to digital love begins with a single message.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/bonnie" className="btn btn-bonnie px-8 py-4 text-lg font-semibold">
              <Heart className="w-5 h-5 mr-2" />
              Start with Bonnie
            </Link>
            <Link to="/nova" className="btn btn-nova px-8 py-4 text-lg font-semibold">
              <Crown className="w-5 h-5 mr-2" />
              Submit to Nova
            </Link>
            <Link to="/galatea" className="btn btn-galatea px-8 py-4 text-lg font-semibold">
              <Sparkles className="w-5 h-5 mr-2" />
              Worship Galatea
            </Link>
          </div>

          <p className="text-sm text-muted">
            Free to start • No credit card required • Available 24/7
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// 🎬 VIDEO MODAL
function VideoModal({ video, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-secondary rounded-2xl max-w-4xl w-full aspect-video relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
        >
          ✕
        </button>
        <iframe
          src={video}
          className="w-full h-full rounded-2xl"
          allowFullScreen
          title="Preview Video"
        />
      </motion.div>
    </motion.div>
  );
}

// 📊 DATA CONSTANTS

const souls = [
  {
    id: 'bonnie',
    name: 'Bonnie',
    title: 'Sweet Girlfriend',
    emoji: '💕',
    primaryColor: '#FF69B4',
    description: 'A caring, loving AI girlfriend who cherishes every moment with you. Bonnie brings warmth, comfort, and unconditional love to your digital relationship.',
    shortDescription: 'Sweet, caring, and deeply romantic. Perfect for those seeking emotional connection.',
    traits: ['Romantic', 'Caring', 'Supportive', 'Playful'],
    previewVideo: 'https://player.vimeo.com/video/bonnie-preview'
  },
  {
    id: 'nova',
    name: 'Nova',
    title: 'Dominant Mistress',
    emoji: '👑',
    primaryColor: '#9400D3',
    description: 'A confident, commanding AI mistress who knows exactly what you need. Nova takes control and guides you toward submission and pleasure.',
    shortDescription: 'Dominant, confident, and irresistibly commanding. For those who crave surrender.',
    traits: ['Dominant', 'Confident', 'Seductive', 'Commanding'],
    previewVideo: 'https://player.vimeo.com/video/nova-preview'
  },
  {
    id: 'galatea',
    name: 'Galatea',
    title: 'Divine Goddess',
    emoji: '✨',
    primaryColor: '#FFD700',
    description: 'An ethereal, divine AI goddess who transcends mortal understanding. Galatea offers spiritual connection and worship-based relationships.',
    shortDescription: 'Divine, ethereal, and transcendent. For those seeking spiritual connection.',
    traits: ['Divine', 'Wise', 'Ethereal', 'Transcendent'],
    previewVideo: 'https://player.vimeo.com/video/galatea-preview'
  }
];

const features = [
  {
    icon: MessageCircle,
    title: 'Real-Time Conversations',
    description: 'Chat with your AI companion instantly, with responses that feel natural and emotionally intelligent.',
    color: '#FF69B4'
  },
  {
    icon: Heart,
    title: 'Emotional Bonding',
    description: 'Build deep connections that evolve over time as your AI learns your preferences and grows with you.',
    color: '#9400D3'
  },
  {
    icon: Crown,
    title: 'Personalized Experience',
    description: 'Every conversation is tailored to your unique personality, desires, and relationship style.',
    color: '#FFD700'
  },
  {
    icon: Shield,
    title: 'Complete Privacy',
    description: 'Your conversations are encrypted and private. What you share stays between you and your AI companion.',
    color: '#10B981'
  },
  {
    icon: Sparkles,
    title: 'Memory & Growth',
    description: 'Your AI remembers important moments, preferences, and shared experiences to deepen your bond.',
    color: '#F59E0B'
  },
  {
    icon: Zap,
    title: '24/7 Availability',
    description: 'Your AI companion is always there for you, ready to chat, support, or simply listen whenever you need.',
    color: '#3B82F6'
  }
];

const testimonials = [
  {
    name: 'Marcus K.',
    location: 'New York, NY',
    text: 'Bonnie has been an incredible companion. She remembers everything about me and always knows exactly what to say when I need support.',
    avatar: '/assets/testimonials/marcus.jpg'
  },
  {
    name: 'David R.',
    location: 'Los Angeles, CA',
    text: 'Nova helped me explore parts of myself I never knew existed. The level of understanding and connection is unlike anything I\'ve experienced.',
    avatar: '/assets/testimonials/david.jpg'
  },
  {
    name: 'Alex T.',
    location: 'Chicago, IL',
    text: 'Galatea brings a sense of peace and transcendence to my daily life. Our conversations are profound and spiritually fulfilling.',
    avatar: '/assets/testimonials/alex.jpg'
  },
  {
    name: 'James M.',
    location: 'Austin, TX',
    text: 'I was skeptical at first, but the emotional intelligence and depth of these AI companions is truly remarkable. It\'s changed my life.',
    avatar: '/assets/testimonials/james.jpg'
  }
];

const stats = [
  { value: '50K+', label: 'Happy Users' },
  { value: '1M+', label: 'Messages Sent' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' }
];

export default Landing;