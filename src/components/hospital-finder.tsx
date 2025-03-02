'use client';
import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Libraries } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '80vh',
  borderRadius: '12px',
  overflow: 'hidden'
};

const defaultCenter = {
  lat: 20.5937, // Default to center of India
  lng: 78.9629
};

const libraries: Libraries = ['places'];

// Hospital icon mapping based on keywords
const getHospitalIcon = (name: string = '') => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('children') || nameLower.includes('pediatric')) {
    return '👶';
  } else if (nameLower.includes('heart') || nameLower.includes('cardiac')) {
    return '❤️';
  } else if (nameLower.includes('eye') || nameLower.includes('vision')) {
    return '👁️';
  } else if (nameLower.includes('dental') || nameLower.includes('teeth')) {
    return '🦷';
  } else if (nameLower.includes('mental') || nameLower.includes('psychiatric')) {
    return '🧠';
  } else if (nameLower.includes('cancer') || nameLower.includes('oncology')) {
    return '🎗️';
  } else if (nameLower.includes('maternity') || nameLower.includes('women')) {
    return '👶';
  } else if (nameLower.includes('ortho') || nameLower.includes('bone')) {
    return '🦴';
  } else {
    return '🏥';
  }
};

// Function to handle phone calls
const handlePhoneCall = (phoneNumber: string) => {
  // Remove any non-numeric characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if the device supports telephone links
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    window.location.href = `tel:${cleanNumber}`;
  } else {
    // For desktop, copy to clipboard
    navigator.clipboard.writeText(phoneNumber).then(() => {
      alert('Phone number copied to clipboard: ' + phoneNumber);
    }).catch(() => {
      alert('Phone number: ' + phoneNumber);
    });
  }
};

export default function HospitalFinder() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hospitals, setHospitals] = useState<google.maps.places.PlaceResult[]>([]);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [selectedHospital, setSelectedHospital] = useState<google.maps.places.PlaceResult | null>(null);
  const [hospitalDetails, setHospitalDetails] = useState<{ [key: string]: google.maps.places.PlaceResult }>({});
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getHospitalDetails = useCallback((hospital: google.maps.places.PlaceResult) => {
    if (!map || !hospital.place_id || hospitalDetails[hospital.place_id]) return;

    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: hospital.place_id,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'rating', 'opening_hours', 'website']
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          setHospitalDetails(prev => ({
            ...prev,
            [hospital.place_id!]: result
          }));
        }
      }
    );
  }, [map, hospitalDetails]);

  const searchNearbyHospitals = useCallback(() => {
    if (!map) return;
    setIsLoading(true);
    setLocationError('');

    const service = new google.maps.places.PlacesService(map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: userLocation,
      radius: 5000,
      type: 'hospital'
    };

    service.nearbySearch(
      request,
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        setIsLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setHospitals(results);
          // Get details for each hospital
          results.forEach(hospital => getHospitalDetails(hospital));
        } else {
          setLocationError('Unable to find hospitals in this area. Please try again.');
        }
      }
    );
  }, [map, userLocation, getHospitalDetails]);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        map?.panTo(newLocation);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location services in your browser.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('An unknown error occurred while getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, [map]);

  // Auto-get user location and search for hospitals when component mounts
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Auto-search hospitals when user location changes
  useEffect(() => {
    if (userLocation !== defaultCenter) {
      searchNearbyHospitals();
    }
  }, [userLocation, searchNearbyHospitals]);

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-900y rounded-xl shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-medium text-black mb-2">Hospitals Near You</h1>
          <p className="text-base text-gray-800">Finding healthcare facilities in your vicinity</p>
        </div>

        {locationError && (
          <div className="bg-red-50 text-black px-6 py-3 rounded-2xl text-sm flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{locationError}</p>
          </div>
        )}

        {hospitals.length > 0 && !locationError && (
          <div className="bg-blue-50 text-black px-6 py-3 rounded-2xl text-sm flex items-center">
              {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> */}
            <p>Located {hospitals.length} healthcare facilities nearby</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                  zoomControl: true,
                  styles: [
                    {
                      featureType: "all",
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#000000" }]
                    },
                    {
                      featureType: "all",
                      elementType: "labels.text.stroke",
                      stylers: [{ color: "#ffffff" }]
                    },
                    {
                      featureType: "poi.business",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }]
                    }
                  ]
                }}
              >
                <Marker
                  position={userLocation}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new google.maps.Size(40, 40),
                    labelOrigin: new google.maps.Point(20, -10)
                  }}
                  label={{
                    text: "You are here",
                    color: "black",
                    fontSize: "14px",
                    fontWeight: "500",
                    className: "marker-label"
                  }}
                />

                {hospitals.map((hospital, index) => (
                  hospital.geometry?.location && (
                    <Marker
                      key={hospital.place_id || index}
                      position={{
                        lat: hospital.geometry.location.lat(),
                        lng: hospital.geometry.location.lng()
                      }}
                      title={hospital.name}
                      onClick={() => setSelectedHospital(hospital)}
                      icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        scaledSize: new google.maps.Size(32, 32),
                        labelOrigin: new google.maps.Point(16, -10)
                      }}
                      label={{
                        text: hospital.name || "",
                        color: "black",
                        fontSize: "14px",
                        fontWeight: "500",
                        className: "marker-label"
                      }}
                    />
                  )
                ))}

                {selectedHospital && selectedHospital.geometry?.location && (
                  <InfoWindow
                    position={{
                      lat: selectedHospital.geometry.location.lat(),
                      lng: selectedHospital.geometry.location.lng()
                    }}
                    onCloseClick={() => setSelectedHospital(null)}
                  >
                    <div className="p-4 max-w-xs bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-3 border-b border-gray-200 pb-3 mb-3">
                        <span className="text-2xl" role="img" aria-label="hospital icon">
                          {getHospitalIcon(selectedHospital.name)}
                        </span>
                        <h3 className="font-medium text-lg text-black">{selectedHospital.name}</h3>
                      </div>
                      {hospitalDetails[selectedHospital.place_id!] && (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="mt-1">📍</span>
                            <p className="text-sm text-black flex-1">
                              {hospitalDetails[selectedHospital.place_id!].formatted_address}
                            </p>
                          </div>
                          {hospitalDetails[selectedHospital.place_id!].formatted_phone_number && (
                            <button
                              onClick={() => handlePhoneCall(hospitalDetails[selectedHospital.place_id!].formatted_phone_number!)}
                              className="flex items-center gap-3 w-full hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                              <span>📞</span>
                              <p className="text-sm text-black hover:text-blue-700 flex-1 text-left">
                                {hospitalDetails[selectedHospital.place_id!].formatted_phone_number}
                              </p>
                            </button>
                          )}
                          {hospitalDetails[selectedHospital.place_id!].rating && (
                            <div className="flex items-center gap-3">
                              <span>⭐</span>
                              <p className="text-sm text-black">
                                {hospitalDetails[selectedHospital.place_id!].rating} / 5
                              </p>
                            </div>
                          )}
                          {hospitalDetails[selectedHospital.place_id!].website && (
                            <a
                              href={hospitalDetails[selectedHospital.place_id!].website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-2 rounded-lg text-black hover:text-blue-700 hover:bg-gray-50 transition-colors group"
                            >
                              <span className="group-hover:opacity-100">🌐</span>
                              <span className="text-sm">Visit Website</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="rounded-2xl shadow-lg border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-medium text-black mb-6 pb-4 border-b border-gray-200">Healthcare Facilities</h2>
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-3 custom-scrollbar">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital.place_id}
                    className="p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-300 group"
                    onClick={() => {
                      setSelectedHospital(hospital);
                      if (map && hospital.geometry?.location) {
                        map.panTo({
                          lat: hospital.geometry.location.lat(),
                          lng: hospital.geometry.location.lng()
                        });
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300" role="img" aria-label="hospital icon">
                        {getHospitalIcon(hospital.name)}
                      </span>
                      <h3 className="font-medium text-lg text-black">{hospital.name}</h3>
                    </div>
                    {hospitalDetails[hospital.place_id!] && (
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3 text-black">
                          <span className="mt-1 opacity-80">📍</span>
                          <p className="flex-1 leading-relaxed">
                            {hospitalDetails[hospital.place_id!].formatted_address}
                          </p>
                        </div>
                        {hospitalDetails[hospital.place_id!].formatted_phone_number && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePhoneCall(hospitalDetails[hospital.place_id!].formatted_phone_number!);
                            }}
                            className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-blue-50 transition-colors duration-300 group"
                          >
                            <span className="opacity-80 group-hover:opacity-100">📞</span>
                            <p className="text-black group-hover:text-blue-700 flex-1 text-left">
                              {hospitalDetails[hospital.place_id!].formatted_phone_number}
                            </p>
                          </button>
                        )}
                        {hospitalDetails[hospital.place_id!].rating && (
                          <div className="flex items-center gap-3 text-black">
                            <span className="opacity-80">⭐</span>
                            <p className="flex-1">
                              {hospitalDetails[hospital.place_id!].rating} / 5
                            </p>
                          </div>
                        )}
                        {hospitalDetails[hospital.place_id!].website && (
                          <a
                            href={hospitalDetails[hospital.place_id!].website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-3 p-2 rounded-xl text-black hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 group"
                          >
                            <span className="opacity-80 group-hover:opacity-100">🌐</span>
                            <span className="flex-1">Visit Website</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
        
        /* Smooth transitions for all interactive elements */
        button, a {
          transition: all 0.3s ease;
        }

        /* Marker label styling */
        .marker-label {
          background-color: white;
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}