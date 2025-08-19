import React, { JSX, useRef, useEffect } from 'react';
import styles from './CandidateFullCard.module.scss';
import { Car, Bike, Truck, Bus, Ship } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Building2, User } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Fix Leaflet marker icon issue
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

interface CandidateFullCardProps {
    candidate: any;
    offer?: any;
}

const licenseTypes = [
    { code: 'Permis A1', description: 'Motocyclettes légères (125 cm³)', icon: Bike, iconClass: styles.motorcycle },
    { code: 'Permis A2', description: 'Motocs de puissance intermédiaire', icon: Bike, iconClass: styles.motorcycle },
    { code: 'Permis A', description: 'Toutes les motocyclettes', icon: Bike, iconClass: styles.motorcycle },
    { code: 'Permis B', description: 'Véhicules légers (voitures)', icon: Car, iconClass: styles.car },
    { code: 'Permis BE', description: 'Voiture avec remorque', icon: Car, iconClass: styles.car },
    { code: 'Permis C1', description: 'Camions jusqu\'à 7,5 tonnes', icon: Truck, iconClass: styles.truck },
    { code: 'Permis C', description: 'Poids lourds', icon: Truck, iconClass: styles.truck },
    { code: 'Permis D1', description: 'Minibus', icon: Bus, iconClass: styles.bus },
    { code: 'Permis D', description: 'Autobus et autocars', icon: Bus, iconClass: styles.bus },
    { code: 'Permis bateau', description: 'Embarcations de plaisance', icon: Ship, iconClass: styles.boat },
];

function getLicenseInfo(code: string) {
    return licenseTypes.find(l => l.code === code);
}

// Helper pour créer un divIcon avec une icône Lucide React
function createLucideDivIcon(icon: JSX.Element, borderColor: string = "#2563eb") {
    return L.divIcon({
        className: "",
        html: `<div style="
            background:#fff;
            border: 3px solid ${borderColor};
            border-radius:50%;
            width:38px;
            height:38px;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        ">
            <span style="display:inline-block;width:26px;height:26px;">${renderToString(icon)}</span>
        </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
    });
}

const CandidateFullCard: React.FC<CandidateFullCardProps> = ({ candidate, offer }) => {
    const candidateLat = Number(candidate.candidateLocationLat);
    const candidateLng = Number(candidate.candidateLocationLng);
    const hasLocation = !isNaN(candidateLat) && !isNaN(candidateLng);
    const offerLat = Number(offer?.latitude);
    const offerLng = Number(offer?.longitude);
    const hasOfferLocation = !isNaN(offerLat) && !isNaN(offerLng);

    // Création des icônes Lucide avec bordure colorée et fond blanc
    const personIcon = createLucideDivIcon(<User color="#2563eb" size={26} />, "#2563eb");
    const companyIcon = createLucideDivIcon(<Building2 color="#dc2626" size={26} />, "#dc2626");

    // Ref pour la carte
    const mapRef = useRef<any>(null);

    // Ajuste la vue pour inclure les deux markers
    useEffect(() => {
        if (mapRef.current && hasLocation && hasOfferLocation) {
            const bounds = L.latLngBounds([
                [candidateLat, candidateLng],
                [offerLat, offerLng]
            ]);
            mapRef.current.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [hasLocation, hasOfferLocation, candidateLat, candidateLng, offerLat, offerLng]);

    return (
        <div className={styles.card} key={candidate.id}>
            <img className={styles.profilePhoto} src={candidate.profilePhoto || candidate.profilePhotoUrl || ''} alt="" />
            <p className={styles.name}>{candidate.lastName} {candidate.firstName}</p>
            <p className={styles.jobTitle}>{candidate.jobTitle}</p>
            <p className={styles.age}>Âge : {candidate.age}</p>
            <p className={styles.phone}>Téléphone : {candidate.phone}</p>
            <p className={styles.location}>Adresse : {candidate.candidateLocationAddress}</p>
            <div className={styles.mapSection}>
                {hasLocation ? (
                    <MapContainer
                        key={candidateLat + '-' + candidateLng}
                        center={[candidateLat, candidateLng]}
                        zoom={13}
                        style={{ height: '200px', width: '100%' }}
                        ref={mapRef}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            position={[candidateLat, candidateLng]}
                            icon={personIcon}
                        />
                        {hasOfferLocation && (
                            <Marker
                                position={[offerLat, offerLng]}
                                icon={companyIcon}
                            />
                        )}
                    </MapContainer>
                ) : (
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                        <span>Localisation non renseignée</span>
                    </div>
                )}
            </div>
            <p className={styles.mobility}>Mobilité : {candidate.mobility}</p>
            <p className={styles.salary}>Salaire : {candidate.salary}</p>
            <p className={styles.bio}>Bio : {candidate.bio}</p>
            <p className={styles.experience}>Résumé : {candidate.experience}</p>
            <p className={styles.education}>Formation : {candidate.education}</p>
            <p className={styles.workExperiences}>Expériences : {candidate.workExperiences}</p>
            <div className={styles.tags}>
                {candidate.hardSkills?.map((skill: string) => (
                    <span className={styles.tag} key={skill}>{skill}</span>
                ))}
                {candidate.softSkills?.map((skill: string) => (
                    <span className={styles.tag} key={skill}>{skill}</span>
                ))}
                {candidate.contractTypes?.map((contract: string) => (
                    <span className={styles.tag} key={contract}>{contract}</span>
                ))}
                {candidate.workModes?.map((workMode: string) => (
                    <span className={styles.tag} key={workMode}>{workMode}</span>
                ))}
            </div>
            {((candidate.licenseList || candidate.licenses)?.length > 0) && (
                <div className={styles.licenseSection}>
                    <div className={styles.licenseHeader}>
                        <span>Permis de conduire</span>
                    </div>
                    <div className={styles.licenseGrid}>
                        {(candidate.licenseList || candidate.licenses)?.map((license: string) => {
                            const info = getLicenseInfo(license);
                            const Icon = info?.icon || Car;
                            return (
                                <span className={styles.licenseTag} key={license}>
                                    <Icon className={styles.licenseIcon + ' ' + (info?.iconClass || '')} />
                                    <span className={styles.licenseCode}>{license}</span>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
            <div className={styles.languages}>
                {candidate.languages?.map((lang: { language: string; level: string }, idx: number) => (
                    <span className={styles.languageTag} key={idx}>
                        {lang.language} ({lang.level})
                    </span>
                ))}
            </div>
        </div>
    );
};

export default CandidateFullCard;