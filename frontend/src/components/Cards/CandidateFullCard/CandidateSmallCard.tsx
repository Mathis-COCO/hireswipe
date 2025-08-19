import React from 'react';
import styles from './CandidateSmallCard.module.scss';

interface CandidateFullCardProps {
    candidate: any;
}

const CandidateFullCard: React.FC<CandidateFullCardProps> = ({ candidate }) => {
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
            <p>{candidate.age}</p>
        </div>
    );
};

export default CandidateFullCard;