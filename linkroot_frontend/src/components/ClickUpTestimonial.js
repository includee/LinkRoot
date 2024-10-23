import React from "react";
import Image from "./clickup.png"; // Adjust the filename and extension

function ClickUpTestimonial() {
  return (
    <div className="bg-white p-8 max-w-7xl mx-auto shadow-md rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side content */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">
            LinkRoot empowers users to create personalized link hubs, making
            sharing and managing links easier than ever.
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "Create Custom Link Groups",
              "Generate Unique QR Codes",
              "Effortless Link Management",
              "Dynamic Real-Time Updates",
              "Secure User Authentication",
            ].map((feature, index) => (
              <span
                key={index}
                className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full border border-yellow-200 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:bg-yellow-200"
              >
                ✓ {feature}
              </span>
            ))}
          </div>

          <blockquote className="text-gray-600 italic mb-6 text-lg">
            "LinkRoot revolutionized our way of organizing and sharing links.
            With its intuitive design and powerful features, managing links has
            never been more seamless."
          </blockquote>
        </div>

        {/* Right side image */}
        <div>
          <img
            src={Image}
            alt="LinkRoot"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default ClickUpTestimonial;
