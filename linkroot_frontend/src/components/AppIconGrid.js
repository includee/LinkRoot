import React from 'react';

const appIcons = [
  { name: "LifeAt" },
  { name: "Convy" },
  { name: "Morgen" },
  { name: "Campsite" },
  { name: "Rise" },
  { name: "ClickUp" },
  { name: "Notion" },
  { name: "Sunsama" },
  { name: "Beeper" },
  { name: "Cal" },
  { name: "Unbounce1" },
  { name: "Unbounce" },
  { name: "Moises" },
  { name: "Basedash" },
  { name: "Cursor" },
  { name: "Linear" },
  { name: "Voiceflow" },
  { name: "Kitemaker" },
];

function AppIconGrid() {
  const renderApps = (apps) => {
    return apps.map((app, index) => (
      <div
        key={index}
        className="flex flex-col items-center justify-center mx-2 p-4 bg-white border border-gray-300 rounded-lg shadow-sm min-w-[150px]"
        aria-label={app.name}
      >
        <span className="text-lg font-medium text-gray-700">{app.name}</span>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* First Strip */}
      <div className="overflow-hidden relative">
        <div className="whitespace-nowrap flex animate-scrollRight">
          {renderApps(appIcons)}
          {renderApps(appIcons)} {/* Duplicate for seamless scroll */}
        </div>
      </div>

      {/* Second Strip */}
      <div className="overflow-hidden relative">
        <div className="whitespace-nowrap flex animate-scrollLeft">
          {renderApps(appIcons)}
          {renderApps(appIcons)} {/* Duplicate for seamless scroll */}
        </div>
      </div>
    </div>
  );
}

export default AppIconGrid;
