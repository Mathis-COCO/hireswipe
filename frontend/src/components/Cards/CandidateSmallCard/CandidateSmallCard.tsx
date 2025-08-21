import React from 'react';
import styles from './CandidateSmallCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { X, Heart } from 'lucide-react';
import { offerService } from '../../../services/offerService';

interface SmallCandidateCardProps {
    candidate: any;
    offerId: string | undefined;
    showActions?: boolean;
}

const SmallCandidateCard: React.FC<SmallCandidateCardProps> = ({ candidate, offerId, showActions }) => {
    const navigate = useNavigate();

    const handleAccept = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!offerId || !candidate.id) return;
        await offerService.updateCandidateStatus(Number(offerId), candidate.id, 'accepted');
        await offerService.createMatch(candidate.id, Number(offerId));
        window.location.reload();
    };

    const handleDeny = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!offerId || !candidate.id) return;
        await offerService.updateCandidateStatus(Number(offerId), candidate.id, 'denied');
        window.location.reload();
    };

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
                {candidate.workModes && candidate.workModes.length > 0 && (
                    <>
                        {candidate.workModes.map((workMode: string) => (
                            <span className={styles.tag} key={workMode}>{workMode}</span>
                        ))}
                    </>
                )}
            </div>
            {(showActions ?? candidate.status === 'pending') && candidate.status === 'pending' && (
                <div className={styles.actionButtons}>
                    <button className={styles.rejectBtn} title="Refuser" onClick={handleDeny}>
                        <span className={styles.iconCircleRed}>
                            <X color="white" size={20} />
                        </span>
                    </button>
                    <button className={styles.acceptBtn} title="Accepter" onClick={handleAccept}>
                        <span className={styles.iconCircleGreen}>
                            <Heart color="white" size={20} />
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SmallCandidateCard;