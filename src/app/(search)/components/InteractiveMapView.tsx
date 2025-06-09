// components/InteractiveMapView.tsx
"use client";

import React, { useEffect, useRef } from 'react';

// NOTE: To use a real map library like Leaflet or Google Maps,
// you would need to install their respective packages and potentially their type definitions.
// e.g., `npm install leaflet @types/leaflet` or `@react-google-maps/api`

// For Leaflet, you'd also need to include its CSS in your global styles or layout:
// import 'leaflet/dist/leaflet.css';

interface ListingLocation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface InteractiveMapViewProps {
  listings: ListingLocation[];
  onMarkerClick?: (listingId: string) => void; // Callback for when a marker is clicked
}

const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({ listings, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // To hold the map instance (e.g., L.Map)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) {
      // Don't run on server, or if map already initialized, or ref not available
      return;
    }

    // Dynamically import Leaflet to ensure it's only loaded on the client-side
    import('leaflet').then(L => {
      // Initialize map
      // Centering on the first listing or a default location
      const initialCenter: L.LatLngTuple = listings.length > 0
        ? [listings[0].location.lat, listings[0].location.lng]
        : [34.0522, -118.2437]; // Default to Los Angeles if no listings

      const map = L.map(mapRef.current!).setView(initialCenter, 10); // Adjust zoom level as needed
      mapInstanceRef.current = map;

      // Add tile layer (OpenStreetMap is a common free option)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add markers for each listing
      listings.forEach(listing => {
        const marker = L.marker([listing.location.lat, listing.location.lng]).addTo(map);
        marker.bindPopup(`<b>${listing.name}</b><br><button onclick="alert('View details for ${listing.id}')">Details</button>`); // Simple popup

        if (onMarkerClick) {
          marker.on('click', () => {
            onMarkerClick(listing.id);
          });
        }
      });

      // Fix for map rendering issues in some cases (e.g., in modals or tabs)
      // setTimeout(() => map.invalidateSize(), 0);

    }).catch(error => console.error("Failed to load Leaflet", error));

    // Cleanup function to remove map instance when component unmounts
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, [listings, onMarkerClick]); // Re-run if listings change

  return (
    <div ref={mapRef} className="h-96 w-full rounded-lg shadow-md bg-gray-200">
      {/* Map will be rendered here by Leaflet */}
      {/* Fallback content if Leaflet doesn't load or while it's loading */}
      {!mapInstanceRef.current && (
        <div className="flex items-center justify-center h-full text-gray-500">
          Loading map...
        </div>
      )}
    </div>
  );
};

export default InteractiveMapView;
