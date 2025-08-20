import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Building2 } from 'lucide-react';
import { renderToString } from 'react-dom/server';

function createProfileIcon(photoUrl: string) {
    return L.divIcon({
        className: "",
        html: `<div style="
            background:#fff;
            border:2px solid #3b82f6;
            border-radius:50%;
            width:44px;
            height:44px;
            display:flex;
            align-items:center;
            justify-content:center;
            overflow:hidden;
            box-shadow:0 2px 8px rgba(59,130,246,0.12);
        ">
            <img src="${photoUrl}" style="width:36px;height:36px;object-fit:cover;border-radius:50%;" />
        </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -44],
    });
}

function createOfferIcon() {
    const svg = renderToString(<Building2 color="#dc2626" size={32} />);
    return L.divIcon({
        className: "",
        html: `<div style="
            background:#fff;
            border:2px solid #dc2626;
            border-radius:50%;
            width:44px;
            height:44px;
            display:flex;
            align-items:center;
            justify-content:center;
            overflow:hidden;
            box-shadow:0 2px 8px rgba(220,38,38,0.12);
        ">
            ${svg}
        </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -44],
    });
}

const FitBounds: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
    const map = useMap();
    React.useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [positions, map]);
    return null;
};

interface OfferCandidateMapProps {
    candidates: any[];
    offer: any;
}

const OfferCandidateMap: React.FC<OfferCandidateMapProps> = ({ candidates, offer }) => {
    const validCandidates = candidates.filter(c => c.latitude && c.longitude);
    const offerLat = Number(offer.latitude);
    const offerLng = Number(offer.longitude);
    const hasOfferLocation = !isNaN(offerLat) && !isNaN(offerLng);

    const candidatePositions: [number, number][] = validCandidates
        .map(c => [Number(c.latitude), Number(c.longitude)])
        .filter(
            (pos): pos is [number, number] =>
                Array.isArray(pos) &&
                pos.length === 2 &&
                pos.every(n => typeof n === 'number' && !isNaN(n))
        );

    const allPositions: [number, number][] = [...candidatePositions];
    if (hasOfferLocation) {
        allPositions.push([offerLat, offerLng]);
    }

    const center: LatLngTuple = allPositions.length > 0
        ? [allPositions[0][0], allPositions[0][1]]
        : [48.8566, 2.3522];

    return (
        <MapContainer
            center={center}
            zoom={6}
            style={{ width: '100%', height: '320px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <FitBounds positions={allPositions} />
            {validCandidates.map(candidate => (
                <Marker
                    key={candidate.id}
                    position={[Number(candidate.latitude), Number(candidate.longitude)]}
                    icon={createProfileIcon(candidate.profilePhoto || candidate.profilePhotoUrl || '')}
                >
                    <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                        {candidate.firstName} {candidate.lastName}
                    </Tooltip>
                </Marker>
            ))}
            {hasOfferLocation && (
                <Marker
                    position={[offerLat, offerLng]}
                    icon={createOfferIcon()}
                >
                    <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                        {offer.title || 'Offre'}
                    </Tooltip>
                </Marker>
            )}
        </MapContainer>
    );
};

export default OfferCandidateMap;