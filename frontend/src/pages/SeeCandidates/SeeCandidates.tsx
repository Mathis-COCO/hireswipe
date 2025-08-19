import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SeeCandidates.module.scss';
import { offerService } from '../../services/offerService';
import { useParams } from 'react-router-dom';
import SmallCandidateCard from '../../components/Cards/CandidateSmallCard/CandidateSmallCard';
import AppNavigation from '../../components/AppNavigation/AppNavigation';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
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
    // Utilise Lucide React pour générer le SVG du marker entreprise
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

const SeeCandidates: React.FC = () => {
    const { offerId: offerId } = useParams<{ offerId: string }>();
    const navigate = useNavigate();

    const [candidates, setCandidates] = React.useState<any[]>([]);
    const [offer, setOffer] = React.useState<any>('');

    React.useEffect(() => {
        offerService.getOfferById(Number(offerId)).then(offer => {
            setOffer(offer);
            setCandidates(offer.candidates);
        });
    }, [offerId]);

    const validCandidates = candidates.filter(c => c.candidateLocationLat && c.candidateLocationLng);
    const center = validCandidates.length > 0
        ? {
            lat: validCandidates.reduce((sum, c) => sum + Number(c.candidateLocationLat), 0) / validCandidates.length,
            lng: validCandidates.reduce((sum, c) => sum + Number(c.candidateLocationLng), 0) / validCandidates.length
        }
        : { lat: 48.8566, lng: 2.3522 };

    return (
        <>
            <div className={styles.wrapper} style={{ paddingBottom: '64px' }}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <button
                            onClick={() => navigate('/mes-offres')}
                            className={styles.backButton}
                        >
                            ← Retour aux offres
                        </button>
                        <h2 className={styles.title}>
                            Candidatures reçues
                        </h2>
                        <p className={styles.subtitle}>
                            {candidates.length} candidat{candidates.length > 1 ? 's' : ''}
                        </p>
                    </header>
                    <div className={styles.mapWrapper}>
                        <MapContainer
                            center={[center.lat, center.lng]}
                            zoom={6}
                            style={{ width: '100%', height: '320px' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {validCandidates.map(candidate => (
                                <Marker
                                    key={candidate.id}
                                    position={[Number(candidate.candidateLocationLat), Number(candidate.candidateLocationLng)]}
                                    icon={createProfileIcon(candidate.profilePhoto || candidate.profilePhotoUrl || '')}
                                >
                                    <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                                        {candidate.firstName} {candidate.lastName}
                                    </Tooltip>
                                </Marker>
                            ))}
                            {offer.latitude && offer.longitude && (
                                <Marker
                                    position={[Number(offer.latitude), Number(offer.longitude)]}
                                    icon={createOfferIcon()}
                                >
                                    <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                                        {offer.title || 'Offre'}
                                    </Tooltip>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>
                    <div className={styles.cardWrapper}>
                        <div className={styles.cardList}>
                            {candidates.map(candidate => (
                                <SmallCandidateCard key={candidate.id} candidate={candidate} offerId={offerId} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <AppNavigation />
        </>
    );
};

export default SeeCandidates;