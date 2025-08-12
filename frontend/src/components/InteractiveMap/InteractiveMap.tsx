import React, { useState } from 'react';
import styles from './InteractiveMap.module.scss';
import { Search, MapPin, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
    initialLatitude?: number;
    initialLongitude?: number;
    onLocationChange: (location: { address: string; lat: number; lng: number }) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
    initialLatitude = 48.8566,
    initialLongitude = 2.3522, 
    onLocationChange 
}) => {
    const [searchAddress, setSearchAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState({ 
        lat: initialLatitude || 48.8566, 
        lng: initialLongitude || 2.3522 
    });
    const [selectedAddress, setSelectedAddress] = useState('');

    const handleAddressSearch = async () => {
        if (!searchAddress) return;
        setIsLoading(true);

        const mockAddressResult = {
            address: searchAddress,
            lat: 48.8566,
            lng: 2.3522,
        };

        if (mockAddressResult) {
            setMapCenter({ lat: mockAddressResult.lat, lng: mockAddressResult.lng });
            setSelectedAddress(mockAddressResult.address);
            onLocationChange(mockAddressResult);
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
                <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[mapCenter.lat, mapCenter.lng]} />
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