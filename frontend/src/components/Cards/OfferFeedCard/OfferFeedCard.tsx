import React from 'react';
import styles from './OfferFeedCard.module.scss';
import FeedActionButtons from '../../Buttons/FeedActionButtons';
import OfferCandidateMap from '../../Maps/OfferCandidateMap.tsx/OfferCandidateMap';
import { authService } from '../../../services/authService';

interface OfferFeedCardProps {
    offer: {
        id: string;
        title: string;
        location?: string;
        salary?: string;
        experience: string;
        contract: string;
        teletravail: boolean;
        description?: string;
        skills: string[];
        avantages: string[];
        latitude?: number;
        longitude?: number;
        category: string;
        imageUrl?: string;
        createdBy?: { firstName?: string; lastName?: string; email?: string };
        candidates?: any[];
        createdAt?: Date | string;
        updatedAt?: Date | string;
        isAvailable: boolean;
    };
    onCross?: () => void;
    onHeart?: () => void;
}

const OfferFeedCard: React.FC<OfferFeedCardProps> = ({ offer, onCross, onHeart }) => {
    const [currentUser, setCurrentUser] = React.useState<any>(null);

    React.useEffect(() => {
        authService.getCurrentUser().then(setCurrentUser);
    }, []);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>{offer.title}</h3>
                <span className={styles.contract}>{offer.contract}</span>
                <span className={offer.isAvailable ? styles.statusAvailable : styles.statusUnavailable}>
                    {offer.isAvailable ? 'Disponible' : 'Indisponible'}
                </span>
            </div>
            <div className={styles.meta}>
                {offer.location && <span className={styles.location}>{offer.location}</span>}
                {offer.salary && <span className={styles.salary}>€ {offer.salary}</span>}
                {offer.experience && <span className={styles.experience}>{offer.experience}</span>}
                {offer.category && <span className={styles.category}>{offer.category}</span>}
                {offer.teletravail && <span className={styles.teletravail}>Télétravail</span>}
            </div>
            {offer.imageUrl && (
                <div className={styles.imageWrapper}>
                    <img src={offer.imageUrl} alt="Illustration de l'offre" className={styles.image} />
                </div>
            )}
            <div className={styles.description}>{offer.description}</div>
            {offer.skills && offer.skills.length > 0 && (
                <div className={styles.tagsRow}>
                    {offer.skills.map((s: string) => (
                        <span key={s} className={styles.tag}>{s}</span>
                    ))}
                </div>
            )}
            {offer.avantages && offer.avantages.length > 0 && (
                <div className={styles.tagsRow}>
                    {offer.avantages.map((a: string) => (
                        <span key={a} className={styles.tagAdvantage}>{a}</span>
                    ))}
                </div>
            )}
            {currentUser && offer.latitude && offer.longitude && (
                <div className={styles.mapWrapper}>
                    <OfferCandidateMap candidates={[currentUser]} offer={offer} />
                </div>
            )}

            <FeedActionButtons
                onCross={onCross || (() => { })}
                onHeart={onHeart || (() => { })}
            />
            <div className={styles.footer}>

                {offer.candidates && (
                    <div className={styles.candidates}>
                        <span>{offer.candidates.length} candidature{offer.candidates.length > 1 ? 's' : ''}</span>
                    </div>
                )}
                {offer.createdAt && (
                    <div className={styles.date}>
                        Publiée le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
                        {offer.createdBy && (
                            <> par {offer.createdBy.firstName || ''} {offer.createdBy.lastName?.toLocaleUpperCase() || ''}</>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfferFeedCard;
