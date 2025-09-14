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
    createdBy?: { firstName?: string; lastName?: string; email?: string; companyName?: string; companyLogo?: string; sector?: string };
        candidates?: any[];
        createdAt?: Date | string;
        updatedAt?: Date | string;
        isAvailable: boolean;
    };
    onCross?: () => void;
    onHeart?: () => void;
    showActions?: boolean;
}

const OfferFeedCard: React.FC<OfferFeedCardProps> = ({ offer, onCross, onHeart, showActions = true }) => {
    const [currentUser, setCurrentUser] = React.useState<any>(null);
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const [drag, setDrag] = React.useState({ x: 0, y: 0, rot: 0 });
    const startRef = React.useRef<{ x: number; y: number } | null>(null);

    React.useEffect(() => {
        authService.getCurrentUser().then(setCurrentUser);
    }, []);

    
    const THRESHOLD = 120;

    const [isAnimating, setIsAnimating] = React.useState(false);

    const pointerDown = (e: React.PointerEvent) => {
        if (isAnimating) return;
        
        const target = e.target as HTMLElement | null;
        if (target) {
            const interactive = target.closest && (target.closest('button, a, input, textarea, select, label') as HTMLElement | null);
            if (interactive) return; 
        }
        try {
            cardRef.current?.setPointerCapture(e.pointerId);
        } catch {
            
        }
        startRef.current = { x: e.clientX, y: e.clientY };
    };

    const pointerMove = (e: React.PointerEvent) => {
        if (!startRef.current || isAnimating) return;
        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;
        const rot = Math.max(-20, Math.min(20, dx / 10));
        setDrag({ x: dx, y: dy, rot });
    };

    const doAction = (action: 'like' | 'dislike') => {
        if (isAnimating) return;
        setIsAnimating(true);
        if (action === 'like') {
            setDrag(d => ({ ...d, x: window.innerWidth, rot: 30 }));
            setTimeout(() => {
                setDrag({ x: 0, y: 0, rot: 0 });
                setIsAnimating(false);
                onHeart && onHeart();
            }, 220);
        } else {
            setDrag(d => ({ ...d, x: -window.innerWidth, rot: -30 }));
            setTimeout(() => {
                setDrag({ x: 0, y: 0, rot: 0 });
                setIsAnimating(false);
                onCross && onCross();
            }, 220);
        }
    };

    const pointerUp = (e: React.PointerEvent) => {
        if (!startRef.current || isAnimating) return;
        const dx = e.clientX - startRef.current.x;
        startRef.current = null;
        try {
            cardRef.current?.releasePointerCapture(e.pointerId);
        } catch {
            
        }
        
        if (dx > THRESHOLD) {
            doAction('like');
        } else if (dx < -THRESHOLD) {
            doAction('dislike');
        } else {
            
            setDrag({ x: 0, y: 0, rot: 0 });
        }
    };

    const transformStyle: React.CSSProperties = {
        transform: `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.rot}deg)`,
    transition: startRef.current ? 'none' : 'transform 180ms ease',
    // allow vertical scrolling while still allowing horizontal swipe handling
    touchAction: 'pan-y',
    };

    
    const absX = Math.abs(drag.x);
    const rawRatio = THRESHOLD > 0 ? absX / THRESHOLD : 0;
    const clamped = Math.max(0, Math.min(1, rawRatio));
    
    
    const alpha = Math.min(0.6, clamped * 0.6);
    
    const overlayColor = drag.x > 0 ? `rgba(52,211,153,${alpha})` : drag.x < 0 ? `rgba(248,113,113,${alpha})` : 'transparent';
    const overlayStyle: React.CSSProperties = {
        backgroundColor: overlayColor,
        pointerEvents: 'none',
        transition: startRef.current ? 'none' : 'background-color 120ms linear',
    };

    return (
        <div
            className={styles.card}
            ref={cardRef}
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={pointerUp}
            style={transformStyle}
        >
            {}
            <div className={styles.dragOverlay} style={overlayStyle} />
            <div className={styles.header}>
                <div className={styles.companyInfo}>
                    {offer.createdBy?.companyLogo ? (
                        <img src={offer.createdBy.companyLogo} alt={offer.createdBy.companyName || 'Logo'} className={styles.companyLogo} />
                    ) : (
                        <div className={styles.companyAvatar} aria-hidden>
                            {(offer.createdBy?.companyName || offer.createdBy?.firstName || 'U').charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className={styles.companyMeta}>
                        <div className={styles.companyNameInline}>{offer.createdBy?.companyName || `${offer.createdBy?.firstName || ''} ${offer.createdBy?.lastName || ''}`.trim()}</div>
                        {offer.createdBy?.sector && <div className={styles.companySector}>{offer.createdBy.sector}</div>}
                    </div>
                </div>
                <div className={styles.titleContainer}>
                    <h3 className={styles.title}>{offer.title}</h3>
                    <div className={styles.badgeRow}>
                        <span className={styles.contract}>{offer.contract}</span>
                        <span className={offer.isAvailable ? styles.statusAvailable : styles.statusUnavailable}>
                            {offer.isAvailable ? 'Disponible' : 'Indisponible'}
                        </span>
                    </div>
                </div>
            </div>
            {}
            <div className={`${styles.swipeIndicator} ${drag.x > 50 ? styles.like : ''}`} style={{ opacity: Math.min(1, Math.abs(drag.x) / 120) }}>
                {drag.x > 0 ? 'J\'aime' : ''}
            </div>
            <div className={`${styles.swipeIndicator} ${drag.x < -50 ? styles.dislike : ''}`} style={{ opacity: Math.min(1, Math.abs(drag.x) / 120) }}>
                {drag.x < 0 ? 'Refuser' : ''}
            </div>

            {/* Central overlay large icon */}
            <div className={styles.centerOverlay} style={{ opacity: Math.min(1, Math.abs(drag.x) / (THRESHOLD * 1.2)) }}>
                {drag.x > 0 ? (
                    <div className={styles.heartIcon} aria-hidden>❤</div>
                ) : drag.x < 0 ? (
                    <div className={styles.crossIcon} aria-hidden>✕</div>
                ) : null}
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
                    <img
                        src={offer.imageUrl}
                        alt="Illustration de l'offre"
                        className={styles.image}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        style={{ touchAction: 'none' }}
                    />
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

            {/* spacer to avoid fixed action buttons overlapping content */}
            <div className={styles.bottomSpacer} aria-hidden />

            {showActions && (
                <div className={styles.actionsContainer}>
                    <FeedActionButtons
                        onCross={onCross || (() => { })}
                        onHeart={onHeart || (() => { })}
                    />
                </div>
            )}
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
