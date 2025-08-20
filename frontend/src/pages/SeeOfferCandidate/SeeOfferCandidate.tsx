import React, { useEffect } from 'react';
import styles from './SeeOfferCandidate.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import CandidateFullCard from '../../components/Cards/CandidateFullCard/CandidateFullCard';
import { userService } from '../../services/userService';
import { offerService } from '../../services/offerService';
import AppNavigation from '../../components/AppNavigation/AppNavigation';

const SeeOfferCandidate: React.FC = () => {
    const navigate = useNavigate();
    const { offerId } = useParams<{ offerId: string }>();
    const { candidateId } = useParams<{ candidateId: string }>();
    const [candidate, setCandidate] = React.useState<any>(null);
    const [offer, setOffer] = React.useState<any>(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            const data = await userService.getUserById(candidateId);
            setCandidate(data);
            const offerData = await offerService.getOfferById(Number(offerId));
            setOffer(offerData);
        };
        fetchCandidate();
    }, [candidateId, offerId]);

    return (
        <>
            <div className={styles.pageBg}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => navigate(`/mes-offres/${offerId}/candidats`)}>← Retour</button>
                    <h2 className={styles.title}>Profil du candidat</h2>
                    <div></div>
                </div>
                <div className={styles.content}>
                    {candidate && <CandidateFullCard candidate={candidate} offer={offer} />}
                </div>
            </div>
            <AppNavigation />
        </>
    );
};

export default SeeOfferCandidate;