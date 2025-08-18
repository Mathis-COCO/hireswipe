import React, { useEffect, useState } from 'react';
import { offerService } from '../../../services/offerService';
import styles from './CandidateFeed.module.scss';
import FeedActionButtons from '../../../components/Buttons/FeedActionButtons';
import { authService } from '../../../services/authService';

const CandidateFeed: React.FC = () => {
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [noOffers, setNoOffers] = useState(false);

useEffect(() => {
  authService.getCurrentUser().then(async (user) => {
    if (user && user.interactedOfferIds?.length > 0) {
      setHasInteracted(true);
      
      try {
        const randomOffer = await offerService.getRandomOfferForCandidate();
        if (!randomOffer) {
          setNoOffers(true);
          setOffer(null);
        } else {
          setOffer(randomOffer);
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
      offerService.getOfferById(user.interactedOfferIds[user.interactedOfferIds.length - 1]).then(offer => {
        setOffer(offer);
        setLoading(false);
      });
    });
  }
}, [hasInteracted]);


  const handleInteractClick = async (hasLiked: boolean) => {
    setHasInteracted(true)
    if (hasLiked) {
      // Ajouter le truc pour postuler à l'offre
    }
    try {
      const data = await offerService.getRandomOfferForCandidate();
      setOffer(data);
    } catch (error) {
      setNoOffers(true);
    }
  };

  return (
    <div className={styles.candidateFeedContainer}>
      {!hasInteracted && (<div>
        <button onClick={() => handleInteractClick(false)}>Démarrer</button>
      </div>)}
      {loading && hasInteracted && <div>Chargement...</div>}
      {hasInteracted && noOffers && <div>Aucune offre disponible.</div>}
      {offer && hasInteracted && !noOffers && (
        <div>
          <div>
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            <p><strong>Lieu:</strong> {offer.location}</p>
            <p><strong>Salaire:</strong> {offer.salary}</p>
            <p><strong>Expérience:</strong> {offer.experience}</p>
            <p><strong>Type de contrat:</strong> {offer.contract}</p>
            <p><strong>Catégorie:</strong> {offer.category}</p>
            <p><strong>Compétences:</strong> {offer.skills?.join(', ')}</p>
            <p><strong>Avantages:</strong> {offer.avantages?.join(', ')}</p>
            <p><strong>Date de publication:</strong> {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString('fr-FR') : ''}</p>
          </div>
        </div>
      )}
      <FeedActionButtons
        onCross={() => handleInteractClick(false)}
        onHeart={() => handleInteractClick(true)}
      />
    </div>
  );
};

export default CandidateFeed;