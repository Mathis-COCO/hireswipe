import React, { useState, useEffect } from 'react';
import styles from './InteractiveMap.module.scss';
import { Search, MapPin, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
    initialLatitude?: number;
    initialLongitude?: number;
    onLocationChange: (location: { address: string; lat: number; lng: number }) => void;
    showDefaultMarker?: boolean;
}

const CenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
    initialLatitude = 48.8566,
    initialLongitude = 2.3522, 
    onLocationChange,
    showDefaultMarker = false
}) => {
    const [searchAddress, setSearchAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState({ 
        lat: initialLatitude || 48.8566, 
        lng: initialLongitude || 2.3522 
    });
    const [selectedAddress, setSelectedAddress] = useState('');
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (
          typeof initialLatitude === 'number' &&
          typeof initialLongitude === 'number' &&
          initialLatitude !== null &&
          initialLongitude !== null
        ) {
          setMarkerPosition({ lat: initialLatitude, lng: initialLongitude });
        } else {
          setMarkerPosition(null);
        }
      }, [initialLatitude, initialLongitude]);

    const handleAddressSearch = async () => {
        if (!searchAddress) return;
        setIsLoading(true);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`
            );
            const results = await response.json();
            if (results && results.length > 0) {
                const found = results[0];
                const lat = parseFloat(found.lat);
                const lng = parseFloat(found.lon);
                setMapCenter({ lat, lng });
                setSelectedAddress(found.display_name);
                onLocationChange({
                    address: found.display_name,
                    lat,
                    lng
                });
            }
        } catch (err) {
        }
        setIsLoading(false);
    };

    const handleCurrentLocation = () => {
        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const mockAddress = "Votre position actuelle";
                    
                    setMapCenter({ lat: latitude, lng: longitude });
                    setSelectedAddress(mockAddress);
                    onLocationChange({
                        address: mockAddress,
                        lat: latitude,
                        lng: longitude
                    });

                    setIsLoading(false);
                },
                () => {
                    setIsLoading(false);
                }
            );
        } else {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <div className={styles.addressSearch}>
                <input
                    type="text"
                    placeholder="Rechercher une ville ou une adresse..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddressSearch(); } }}
                />
                <button type="button" onClick={handleAddressSearch} disabled={isLoading} className={styles.searchButton}>
                    <Search size={20} />
                </button>
                <button type="button" onClick={handleCurrentLocation} disabled={isLoading} className={styles.locationButton}>
                    <LocateFixed size={20} />
                </button>
            </div>
            
            <div className={styles.mapContainer}>
                <MapContainer
                    center={[
                        markerPosition ? markerPosition.lat : 48.8566,
                        markerPosition ? markerPosition.lng : 2.3522
                    ]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {markerPosition && (
                        <Marker position={[markerPosition.lat, markerPosition.lng]}>
                        </Marker>
                    )}
                    <CenterMap lat={mapCenter.lat} lng={mapCenter.lng} />
                </MapContainer>
            </div>
            
            {selectedAddress && (
                <div className={styles.selectedLocation}>
                    <MapPin size={20} />
                    <p>{selectedAddress}</p>
                </div>
            )}
        </>
    );
};

export default InteractiveMap;