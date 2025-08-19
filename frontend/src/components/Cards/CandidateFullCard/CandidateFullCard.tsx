import React, { JSX, useRef, useEffect } from 'react';
import styles from './CandidateFullCard.module.scss';
import { Car, Bike, Truck, Bus, Ship } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Building2, User } from 'lucide-react';
import { renderToString } from 'react-dom/server';
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

    const personIcon = createLucideDivIcon(<User color="#2563eb" size={26} />, "#2563eb");
    const companyIcon = createLucideDivIcon(<Building2 color="#dc2626" size={26} />, "#dc2626");

    const mapRef = useRef<any>(null);

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
            <div className={styles.headerInfo}>
                <img className={styles.profilePhoto} src={candidate.profilePhoto || candidate.profilePhotoUrl || ''} alt="" />
                <div className={styles.headerText}>
                    <div>
                        {(candidate.lastName || candidate.firstName) && (
                            <p className={styles.name}>
                                {candidate.lastName} {candidate.firstName}
                                {candidate.age ? ` (${candidate.age})` : ''}
                            </p>
                        )}
                        {candidate.jobTitle && (
                            <p className={styles.jobTitle}>{candidate.jobTitle}</p>
                        )}
                    </div>
                    {candidate.candidateLocationAddress && (
                        <p className={styles.locationHeader}>{candidate.candidateLocationAddress}</p>
                    )}
                </div>
            </div>

            {(candidate.candidateLocationAddress || hasLocation) && (
                <div className={styles.section}>
                    <div className={styles.locationMapWrapper}>
                        {hasLocation && (
                            <div className={styles.mapSection}>
                                <MapContainer
                                    key={candidateLat + '-' + candidateLng}
                                    center={[candidateLat, candidateLng]}
                                    zoom={13}
                                    style={{ height: '100%', width: '100%' }}
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
                            </div>
                        )}
                    </div>
                </div>
            )}

            {candidate.mobility && (
                <div className={styles.section}>
                    <div className={styles.flexRow}>
                        {candidate.mobility && (
                            <div className={styles.mobility}><span className={styles.label}>Mobilité :</span> {candidate.mobility}</div>
                        )}
                    </div>
                </div>
            )}

            {(candidate.bio || candidate.experience || candidate.education || candidate.workExperiences) && (
                <div className={styles.section}>
                    {candidate.bio && (
                        <div className={styles.bio}><span className={styles.label}>Bio :</span> {candidate.bio}</div>
                    )}
                    <div className={styles.flexRow}>
                        {candidate.experience && (
                            <div className={styles.experience}><span className={styles.label}>Résumé :</span> {candidate.experience}</div>
                        )}
                        {candidate.education && (
                            <div className={styles.education}><span className={styles.label}>Formation :</span> {candidate.education}</div>
                        )}
                    </div>
                    {candidate.workExperiences && (
                        <div className={styles.workExperiences}><span className={styles.label}>Expériences :</span> {candidate.workExperiences}</div>
                    )}
                </div>
            )}

            {(candidate.hardSkills?.length > 0 || candidate.softSkills?.length > 0) && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Compétences</div>
                    <div className={styles.tags}>
                        {candidate.hardSkills?.map((skill: string) => (
                            <span className={styles.tag} key={skill}>{skill}</span>
                        ))}
                        {candidate.softSkills?.map((skill: string) => (
                            <span className={styles.tag} key={skill}>{skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {(candidate.contractTypes?.length > 0 || candidate.workModes?.length > 0) && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Préférences</div>
                    <div className={styles.tags}>
                        {candidate.contractTypes?.map((contract: string) => (
                            <span className={styles.tag} key={contract}>{contract}</span>
                        ))}
                        {candidate.workModes?.map((workMode: string) => (
                            <span className={styles.tag} key={workMode}>{workMode}</span>
                        ))}
                    </div>
                </div>
            )}

            {((candidate.licenseList || candidate.licenses)?.length > 0) && (
                <div className={styles.section}>
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

            {candidate.languages?.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Langues</div>
                    <div className={styles.languages}>
                        {candidate.languages?.map((lang: { language: string; level: string }, idx: number) => (
                            <span className={styles.languageTag} key={idx}>
                                {lang.language} ({lang.level})
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateFullCard;