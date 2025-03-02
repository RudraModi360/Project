import React from 'react';

interface HealthcareFacility {
  name: string;
  address: string;
  rating?: string;
  phone?: string;
}

interface HealthcareFacilitiesProps {
  facilities: HealthcareFacility[];
}

const LineWithDot = () => {
  return (
    <div className="relative flex flex-col items-center mr-4">
      <div className="absolute h-full w-0.5 bg-gray-200"></div>
      <div className="w-4 h-4 bg-blue-600 rounded-full shadow-md border-2 border-white"></div>
    </div>
  );
};

const HealthcareFacilities: React.FC<HealthcareFacilitiesProps> = ({ facilities }) => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-10 text-center">Healthcare Facilities</h2>
      <div className="space-y-8">
        {facilities.map((facility, index) => (
          <div
            key={index}
            className={`flex items-start ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <LineWithDot />
            <div 
              className={`flex-grow bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
                index % 2 === 0 ? 'mr-8' : 'ml-8'
              }`}
            >
              <div className={`flex items-start gap-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="flex-shrink-0">
                  <span className="text-3xl bg-blue-50 w-12 h-12 flex items-center justify-center rounded-full">🏥</span>
                </div>
                <div className={`flex-grow space-y-3 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <h3 className="text-xl font-medium text-gray-900">{facility.name}</h3>
                  <div className={`flex items-start gap-2 text-gray-600 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <span className="mt-1">📍</span>
                    <p className="text-sm">{facility.address}</p>
                  </div>
                  {facility.rating && (
                    <div className={`flex items-center gap-2 text-gray-600 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <span>⭐</span>
                      <p className="text-sm">{facility.rating}</p>
                    </div>
                  )}
                  {facility.phone && (
                    <div className={`flex items-center gap-2 text-gray-600 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <span>📞</span>
                      <a 
                        href={`tel:${facility.phone}`}
                        className="text-sm hover:text-blue-600 transition-colors"
                      >
                        {facility.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthcareFacilities; 