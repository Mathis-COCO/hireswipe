import React from 'react';
import styles from './CandidateSmallCard.module.scss';
import { useNavigate } from 'react-router-dom';

interface SmallCandidateCardProps {
    candidate: any;
    offerId: string | undefined;
}

const SmallCandidateCard: React.FC<SmallCandidateCardProps> = ({ candidate, offerId }) => {
    const navigate = useNavigate();
    
    return (
        <div className={styles.card} key={candidate.id} onClick={() => navigate(`/mes-offres/${offerId}/candidats/${candidate.id}`)}>
            <img className={styles.profilePhoto} src={candidate.profilePhoto} alt="profil" />
            <p className={styles.name}>{candidate.lastName} {candidate.firstName} ({candidate.age} ans)</p>
            <p className={styles.jobTitle}>{candidate.jobTitle} {candidate.experience}</p>
            <div className={styles.tags}>
                {candidate.contractTypes.map((contract: string) => (
                    <span className={styles.tag} key={contract}>{contract}</span>
                ))}
            </div>
            <div className={styles.tags}>
                {candidate.workModes.map((workMode: string) => (
                    <span className={styles.tag} key={workMode}>{workMode}</span>
                ))}
            </div>
        </div>
    );
};

export default SmallCandidateCard;