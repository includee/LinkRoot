import React, { useState } from 'react';

// Define the plans with detailed descriptions
const plans = [
  {
    name: "Free",
    description: "For personal use or testing your app before deploying to customers.",
    price: "Free",
    features: [
      { name: "Feature 1", included: true },
      { name: "Feature 2", included: true },
      { name: "Feature 3", included: false },
      { name: "Feature 4", included: false },
    ],
    details: "The Free plan is ideal for individuals who want to explore the basics of LinkRoot without any cost. It includes essential features to get started but comes with limited functionality and support options.",
  },
  {
    name: "Essential",
    description: "For simple desktop apps.",
    price: "$99/month",
    features: [
      { name: "Feature 1", included: true },
      { name: "Feature 2", included: true },
      { name: "Feature 3", included: false },
      { name: "Feature 4", included: false },
    ],
    details: "The Essential plan is perfect for small businesses and developers building simple desktop applications. It includes access to essential APIs, priority support, and basic customization options.",
  },
  {
    name: "Professional",
    description: "For sophisticated desktop apps.",
    price: "$199/month",
    features: [
      { name: "Feature 1", included: true },
      { name: "Feature 2", included: true },
      { name: "Feature 3", included: true },
      { name: "Feature 4", included: true },
    ],
    popular: true,
    details: "The Professional plan is designed for companies that need advanced features, complete API access, and premium support. This plan allows for extensive customization, priority updates, and dedicated assistance.",
  },
];

// Modal Component
function PlanModal({ plan, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">{plan.name} Plan Details</h3>
        <p className="text-gray-700 mb-4">{plan.details}</p>
        <ul className="mb-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center mb-2">
              {feature.included ? (
                <span className="text-green-500 mr-2">✔</span>
              ) : (
                <span className="text-gray-300 mr-2">✘</span>
              )}
              <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function PricingPlans() {
  // State to track the selected plan for highlighting and modal
  const [selectedPlanName, setSelectedPlanName] = useState(null);
  const [modalPlan, setModalPlan] = useState(null);

  // Handle card click to select a plan
  const handlePlanClick = (planName) => {
    setSelectedPlanName(planName);
  };

  // Handle "Read Docs" button click
  const handleReadDocsClick = (plan, e) => {
    e.stopPropagation(); // Prevent card click handler from also being triggered
    setModalPlan(plan);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalPlan(null);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold mb-2">Choose a plan that fits</h2>
      <h3 className="text-4xl font-bold mb-12">your needs</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative p-6 rounded-lg shadow-lg border cursor-pointer transition transform duration-300 hover:scale-105 ${
              plan.popular ? 'border-indigo-500' : 'border-gray-200'
            } ${
              selectedPlanName === plan.name
                ? 'bg-indigo-50 border-indigo-600'
                : 'bg-white'
            }`}
            onClick={() => handlePlanClick(plan.name)}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-indigo-500 text-white px-2 py-1 rounded">
                Most Popular
              </div>
            )}
            <h4 className="text-2xl font-bold mb-2">{plan.name}</h4>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <p className="text-3xl font-bold mb-4">
              {plan.price ? plan.price : 'Free'}
            </p>
            <h5 className="font-semibold mb-2">KEY FEATURES</h5>
            <ul className="mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center mb-2">
                  {feature.included ? (
                    <span className="text-green-500 mr-2">✔</span>
                  ) : (
                    <span className="text-gray-300 mr-2">✘</span>
                  )}
                  <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={(e) => handleReadDocsClick(plan, e)}
              className={`w-full py-2 px-4 rounded-lg transition ${
                plan.popular
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Read Docs
            </button>
          </div>
        ))}
      </div>

      {/* Modal Display */}
      {modalPlan && <PlanModal plan={modalPlan} onClose={handleCloseModal} />}

      {/* Display the selected plan name */}
      {selectedPlanName && !modalPlan && (
        <div className="mt-8 text-center">
          <h4 className="text-2xl font-semibold text-indigo-600">
            You have selected the {selectedPlanName} plan.
          </h4>
        </div>
      )}
    </div>
  );
}

export default PricingPlans;
