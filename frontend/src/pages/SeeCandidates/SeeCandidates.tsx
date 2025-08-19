import React from 'react';
import styles from './SeeCandidates.module.scss';
import { offerService } from '../../services/offerService';
import { useParams } from 'react-router-dom';
import SmallCandidateCard from '../../components/Cards/CandidateSmallCard/CandidateSmallCard';

const SeeCandidates: React.FC = () => {
    const { id: offerId } = useParams<{ id: string }>();

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
        <div style={{
            background: '#f9fafb',
            minHeight: '100vh',
            padding: '32px 0'
        }}>
            <div style={{
                maxWidth: 1100,
                margin: '0 auto',
                padding: '0 24px'
            }}>
                <header style={{
                    marginBottom: 32,
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#222',
                        marginBottom: 8
                    }}>
                        Candidatures reçues
                    </h2>
                    <p style={{
                        color: '#666',
                        fontSize: '1rem'
                    }}>
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