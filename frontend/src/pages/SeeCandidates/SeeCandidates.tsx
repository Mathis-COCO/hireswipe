import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './SeeCandidates.module.scss';
import { offerService } from '../../services/offerService';
import SmallCandidateCard from '../../components/Cards/CandidateSmallCard/CandidateSmallCard';
import AppNavigation from '../../components/AppNavigation/AppNavigation';
import 'leaflet/dist/leaflet.css';
import OfferCandidateMap from '../../components/Maps/OfferCandidateMap.tsx/OfferCandidateMap';

const SeeCandidates: React.FC = () => {
    const { offerId } = useParams<{ offerId: string }>();
    const navigate = useNavigate();

    const [candidates, setCandidates] = React.useState<any[]>([]);
    const [offer, setOffer] = React.useState<any>({});
    const [userType, setUserType] = React.useState<'candidat' | 'entreprise' | null>(null);

    React.useEffect(() => {
        if (!offerId) return;
        offerService.getOfferById(Number(offerId)).then(offerData => {
            setOffer(offerData);
            setUserType(offerData?.recruiter?.role ?? null);

            const users = (offerData.candidates || [])
                .map((c: any) => ({ ...c.user, status: c.status }))
                .filter((u: any) => u);
            setCandidates(users);
        });
    }, [offerId]);

    const pendingCandidates = candidates.filter(u => u.status === 'pending');
    const acceptedCandidates = candidates.filter(u => u.status === 'accepted');
    const deniedCandidates = candidates.filter(u => u.status === 'denied');

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <button
                            onClick={() => navigate('/mes-offres')}
                            className={styles.backButton}
                        >
                            ← Retour aux offres
                        </button>
                        <h2 className={styles.title}>Candidatures reçues</h2>
                        <p className={styles.subtitle}>
                            {candidates.length} candidat{candidates.length > 1 ? 's' : ''}
                        </p>
                    </header>
                    <div className={styles.mapWrapper}>
                        <OfferCandidateMap candidates={candidates} offer={offer} />
                    </div>
                    <div className={styles.cardWrapper}>
                        <div className={styles.listSection}>
                            <h3 className={`${styles.listLabel} ${styles.labelPending}`}>Candidats en attente</h3>
                            <div className={styles.cardList}>
                                {pendingCandidates.length === 0 && (
                                    <p className={styles.emptyText}>Aucun candidat en attente</p>
                                )}
                                {pendingCandidates.map(u => (
                                    <SmallCandidateCard
                                        key={u.id}
                                        candidate={u}
                                        offerId={offerId}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.listSection}>
                            <h3 className={`${styles.listLabel} ${styles.labelAccepted}`}>Candidats matchés</h3>
                            <div className={styles.cardList}>
                                {acceptedCandidates.length === 0 && (
                                    <p className={styles.emptyText}>Aucun candidat matché</p>
                                )}
                                {acceptedCandidates.map(u => (
                                    <SmallCandidateCard
                                        key={u.id}
                                        candidate={u}
                                        offerId={offerId}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={`${styles.listSection} ${styles.deniedWrapper}`}>
                            <h3 className={`${styles.listLabel} ${styles.labelDenied}`}>Candidats refusés</h3>
                            <div className={styles.cardList}>
                                {deniedCandidates.length === 0 && (
                                    <p className={styles.emptyText}>Aucun candidat refusé</p>
                                )}
                                {deniedCandidates.map(u => (
                                    <SmallCandidateCard
                                        key={u.id}
                                        candidate={u}
                                        offerId={offerId}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AppNavigation accountType={userType} />
        </>
    );
};

export default SeeCandidates;
