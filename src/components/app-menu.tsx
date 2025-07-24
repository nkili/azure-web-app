import React from 'react';

export interface AppOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  isComingSoon?: boolean;
  category?: string;
}

interface AppMenuProps {
  apps: AppOption[];
  onSelectApp: (appId: string) => void;
}

export const AppMenu: React.FC<AppMenuProps> = ({ apps, onSelectApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Azure Web App Showcase</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of interactive web applications. Choose an app below to get started.
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map(app => (
            <div
              key={app.id}
              className={`
                bg-white rounded-xl shadow-lg p-6 transition-all duration-200 border
                ${
                  app.isComingSoon
                    ? 'opacity-60 cursor-not-allowed border-gray-200'
                    : 'hover:shadow-xl hover:scale-105 cursor-pointer border-transparent hover:border-blue-200'
                }
              `}
              onClick={() => !app.isComingSoon && onSelectApp(app.id)}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{app.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {app.name}
                  {app.isComingSoon && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{app.description}</p>
                {app.category && (
                  <div className="mt-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{app.category}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">Built with React, TypeScript, and Azure Web Apps</p>
        </div>
      </div>
    </div>
  );
};
