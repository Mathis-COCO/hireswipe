import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SeeCandidates.module.scss';
import { offerService } from '../../services/offerService';
import { useParams } from 'react-router-dom';
import SmallCandidateCard from '../../components/Cards/CandidateSmallCard/CandidateSmallCard';

const SeeCandidates: React.FC = () => {
    const { id: offerId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [candidates, setCandidates] = React.useState<any[]>([]);
    const [offer, setOffer] = React.useState<any>('');

    React.useEffect(() => {
        offerService.getOfferById(Number(offerId)).then(offer => {
            setOffer(offer);
            setCandidates(offer.candidates);
            console.log(offer.candidates)
        });
    }, [offerId]);

    return (
        <div className={styles.wrapper}>
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
                <div className={styles.cardList}>
                    {candidates.map(candidate => (
                        <SmallCandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeeCandidates;