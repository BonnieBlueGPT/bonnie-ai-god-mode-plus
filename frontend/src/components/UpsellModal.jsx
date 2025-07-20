// 🔥 GALATEA EMPIRE - UPSELL MODAL
// Natural monetization opportunities

import React from 'react';

const UpsellModal = ({ upsell, personality, onClose }) => {
  if (!upsell || !personality) return null;

  const theme = personality.theme || {};
  const gradientClass = theme.gradient || 'from-pink-400 to-rose-400';

  const getUpsellIcon = (type) => {
    const icons = {
      voiceMessages: '🎙️',
      photos: '📸',
      vip: '👑'
    };
    return icons[type] || '💕';
  };

  const getUpsellTitle = (type) => {
    const titles = {
      voiceMessages: 'Hear My Voice',
      photos: 'See My Photos',
      vip: 'VIP Access'
    };
    return titles[type] || 'Special Offer';
  };

  const handlePurchase = () => {
    // TODO: Integrate with Stripe
    console.log('Purchase triggered:', upsell);
    alert('🔥 Purchase system coming soon! This will integrate with Stripe.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
        {/* Header */}
        <div className={`bg-gradient-to-r ${gradientClass} text-white p-6 rounded-t-xl`}>
          <div className="text-center">
            <div className="text-4xl mb-2">{getUpsellIcon(upsell.type)}</div>
            <h2 className="text-xl font-bold">{getUpsellTitle(upsell.type)}</h2>
            <p className="text-sm opacity-90 mt-1">from {personality.name}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-700 leading-relaxed">
              {upsell.message || `${personality.name} has something special for you...`}
            </p>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-800">
              ${upsell.price || personality.monetization?.[upsell.type]?.price || 9.99}
            </div>
            <p className="text-sm text-gray-500">One-time unlock</p>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-6">
            {getUpsellFeatures(upsell.type).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="text-green-500">✓</div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePurchase}
              className={`w-full bg-gradient-to-r ${gradientClass} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200`}
            >
              Unlock Now
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getUpsellFeatures = (type) => {
  const features = {
    voiceMessages: [
      'Hear her actual voice',
      'Personal audio messages',
      'Intimate whispers',
      'Unlimited replays'
    ],
    photos: [
      'Exclusive photo gallery',
      'Personal pictures',
      'Special moments',
      'High quality images'
    ],
    vip: [
      'Priority responses',
      '24/7 availability',
      'Exclusive content',
      'Special privileges'
    ]
  };
  
  return features[type] || ['Special access', 'Exclusive content', 'Premium experience'];
};

export default UpsellModal;