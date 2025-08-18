import React, { useEffect, useState } from 'react';
import { offerService } from '../../../services/offerService';
import styles from './CandidateFeed.module.scss';
import FeedActionButtons from '../../../components/Buttons/FeedActionButtons';
import { authService } from '../../../services/authService';

const CandidateFeed: React.FC = () => {
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

useEffect(() => {
  authService.getCurrentUser().then(user => {
    if (user) {
      setHasInteracted(user.interactedOfferIds?.length > 0);
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
    const data = await offerService.getRandomOfferForCandidate();
    setOffer(data);
  };

  return (
    <div className={styles.candidateFeedContainer}>
      {!hasInteracted && (<div>
        <button onClick={() => handleInteractClick(false)}>Démarrer</button>
      </div>)}
      {loading && hasInteracted && <div>Chargement...</div>}
      {/* {!offer && hasInteracted && <div>Aucune offre disponible.</div>} */}
      {/* a fix en ajoutant une vérif sur le nombre d'annonces disponibles */}
      {offer && hasInteracted && (
        <div>
          <h2>Annonce aléatoire</h2>
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