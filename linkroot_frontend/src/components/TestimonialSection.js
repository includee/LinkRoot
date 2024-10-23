import React from "react";

// TestimonialCard component with a diagonal, subtle gradient on hover
function TestimonialCard({ title, description, details }) {
  return (
    <div
      className="p-6 border rounded-lg shadow-sm transition duration-300 bg-pink-50 max-w-md mx-auto
        hover:bg-gradient-to-br hover:from-pink-100 hover:via-purple-100 hover:to-yellow-100 hover:text-gray-800"
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-3">
          <span className="text-blue-600 text-lg font-semibold">&lt;/&gt;</span>
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <p className="text-gray-700 mb-2">{description}</p>
      <p className="text-gray-600">{details}</p>
    </div>
  );
}

// TestimonialSection component
export default function TestimonialSection() {
  const cards = [
    {
      title: "Group Creation and Link Management",
      description:
        "LinkRoot allows users to create customizable groups where they can add and manage their links. This feature is ideal for organizing links related to different topics, projects, or personal pages.",
      details:
        "With an intuitive interface, users can effortlessly add, edit, or delete links within each group, providing a streamlined experience.",
    },
    {
      title: "Unique QR Code Generation",
      description:
        "Every group created on LinkRoot automatically generates a unique QR code. This makes sharing easier and more engaging, providing a quick way for others to access your grouped links.",
      details:
        "The QR codes are dynamic, reflecting real-time changes made to the group, ensuring the shared content is always up-to-date.",
    },
    {
      title: "Seamless Frontend-Backend Integration",
      description:
        "Built with React and JavaScript on the frontend and Django with REST API on the backend, LinkRoot provides a fast and responsive user experience. The integration ensures reliable communication between the client and server.",
      details:
        "Using Djoser for authentication, LinkRoot provides secure and efficient user management, allowing users to sign up, log in, and manage their accounts seamlessly.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <TestimonialCard
            key={index}
            title={card.title}
            description={card.description}
            details={card.details}
          />
        ))}
      </div>
    </div>
  );
}
