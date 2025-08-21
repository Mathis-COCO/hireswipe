import React, { useEffect, useState } from 'react';
import { offerService } from '../../../services/offerService';
import styles from './CandidateFeed.module.scss';
import { authService } from '../../../services/authService';
import OfferFeedCard from '../../../components/Cards/OfferFeedCard/OfferFeedCard';

const CandidateFeed: React.FC = () => {
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [noOffers, setNoOffers] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then(async (user) => {
      if (user && Array.isArray(user.interactedOfferIds) && user.interactedOfferIds.length > 0) {
        setHasInteracted(true);
        try {
          const hasRemaining = await offerService.hasRemainingOffer();
          if (!hasRemaining) {
            setNoOffers(true);
            setOffer(null);
          }
        } catch {
          setNoOffers(true);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (hasInteracted) {
      authService.getCurrentUser().then(user => {
        const lastId = Array.isArray(user?.interactedOfferIds)
          ? user.interactedOfferIds[user.interactedOfferIds.length - 1]
          : null;
        if (lastId) {
          offerService.getOfferById(lastId).then(offer => {
            setOffer(offer);
            setLoading(false);
          });
        }
      });
    }
  }, [hasInteracted]);

  const handleInteractClick = async (hasLiked: boolean) => {
    setHasInteracted(true);
    if (hasLiked) {
      offerService.applyToOffer(offer.id);
    }
    try {
      const data = await offerService.getRandomOfferForCandidate();
      setOffer(data);
    } catch {
      setNoOffers(true);
    }
  };

  return (
    <div className={styles.candidateFeedContainer}>
      {!hasInteracted && (
        <div>
          <button onClick={() => handleInteractClick(false)}>Démarrer</button>
        </div>
      )}
      {loading && hasInteracted && <div>Chargement...</div>}
      {hasInteracted && noOffers && <div>Aucune offre disponible.</div>}
      {offer && hasInteracted && !noOffers && (
        <div className={styles.offerFeedCardPageCenter}>
          <OfferFeedCard
            offer={offer}
            onCross={() => handleInteractClick(false)}
            onHeart={() => handleInteractClick(true)}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateFeed;
