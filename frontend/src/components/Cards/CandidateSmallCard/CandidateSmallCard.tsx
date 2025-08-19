import React from 'react';
import styles from './CandidateSmallCard.module.scss';

interface SmallCandidateCardProps {
    candidate: any;
}

const SmallCandidateCard: React.FC<SmallCandidateCardProps> = ({ candidate }) => {
    return (
        <div className={styles.card} key={candidate.id}>
            <img className={styles.profilePhoto} src={candidate.profilePhoto} alt="" />
            <p className={styles.name}>{candidate.lastName} {candidate.firstName}</p>
            <p className={styles.jobTitle}>{candidate.jobTitle}</p>
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