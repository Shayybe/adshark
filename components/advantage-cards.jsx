import React from 'react';
import { Heart, Filter, Settings, Layout, Image, DollarSign } from 'lucide-react';

const Card = ({ Icon, title, description }) => (
  <div className="bg-gray-50 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="mb-6">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <div className="flex items-center text-blue-500 hover:text-blue-600 cursor-pointer">
      <span className="font-medium">Learn More</span>
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);

const AdSharkCards = () => {
  const cards = [
    {
      Icon: Heart,
      title: "Partner Support",
      description: "Get dedicated support from expert managers who help optimize your campaigns and maximize returns. Our team provides personalized guidance and strategic insights for your success."
    },
    {
      Icon: Filter,
      title: "Quality Traffic & Safety",  
      description: "Advanced multi-layer security system that prevents fraud and ensures high-quality traffic. Our intelligent algorithms deliver ads to relevant audiences based on extensive targeting parameters."
    },
    {
      Icon: Settings,
      title: "Smart Campaign Tools",
      description: "Access powerful optimization tools including Traffic Estimator and Smart Bidding to streamline your campaigns. Custom bidding options help maximize performance and ROI."
    },
    {
      Icon: Layout,
      title: "Easy-to-Use Platform",
      description: "Our intuitive self-serve platform makes it simple to launch and manage campaigns. Automate routine tasks while maintaining full control over your advertising."
    },
    {
      Icon: Image,
      title: "Engaging Ad Formats",
      description: "Choose from exclusive ad formats designed to capture attention and drive engagement. Reach your target audience effectively with compelling creative options."
    },
    {
      Icon: DollarSign,
      title: "Competitive Pricing",
      description: "Get excellent value with competitive rates and no minimum spend requirements. Our pricing model focuses on delivering strong ROI across all traffic types."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-2 bg-gray-800 text-white rounded-full text-sm mb-4">
          The AdShark Advantage
        </div>
        <h2 className="text-4xl font-bold mb-4">
          Why Choose <span className="text-blue-400">AdShark</span>?
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default AdSharkCards;