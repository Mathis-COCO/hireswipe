import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { offerService } from '../../services/offerService';
import localStyles from './OfferDetail.module.scss';
import OfferCandidateMap from '../../components/Maps/OfferCandidateMap.tsx/OfferCandidateMap';
import { authService } from '../../services/authService';

const OfferDetail: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!offerId) return;
      try {
        const data = await offerService.getOfferById(offerId as any);
        setOffer(data);
        const me = await authService.getCurrentUser();
        setIsOwner(Boolean(me && data && data.createdBy && me.id && String(me.id) === String(data.createdBy.id)));
      } catch (err) {
  console.error('Erreur en chargeant l\'offre', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [offerId]);

  if (loading) return <div className={localStyles.detailContainer}>Chargement...</div>;
  if (!offer) return <div className={localStyles.detailContainer}>Offre introuvable</div>;

  return (
    <div className={localStyles.detailContainer}>
      <div className={localStyles.card}>
        <div className={localStyles.headerRow}>
          <div>
            <div className={localStyles.title}>{offer.title}</div>
            <div className={localStyles.metaRow}>{offer.createdAt ? `Publiée le ${new Date(offer.createdAt).toLocaleDateString('fr-FR')}` : ''}</div>
            {!isOwner && (
              <div className={localStyles.companySection}>
                {offer.createdBy?.companyLogo ? (
                  <img src={offer.createdBy.companyLogo} alt={offer.createdBy.companyName ? `${offer.createdBy.companyName} logo` : 'Company logo'} className={localStyles.companyLogo} />
                ) : null}
                <div>
                  <div className={localStyles.companyName}>{offer.createdBy?.companyName || `${offer.createdBy?.firstName || ''} ${offer.createdBy?.lastName || ''}`.trim()}</div>
                  <div className={localStyles.companySector}>{offer.createdBy?.sector || ''}</div>
                </div>
              </div>
            )}
          </div>
          <div className={localStyles.actions}>
            <button className={localStyles.ghostBtn} onClick={() => navigate('/mes-offres')}>Retour</button>
            {isOwner && (
              <button
                className={localStyles.ghostBtn}
                onClick={() => navigate(`/mes-offres/${offerId}/edit`)}
              >
                Modifier
              </button>
            )}
            <button className={localStyles.primaryBtn} onClick={() => navigate(`/mes-offres/${offerId}/candidats`)}>Voir les candidatures ({(offer.candidates || []).length})</button>
          </div>
        </div>

        <div className={localStyles.contentRow}>
          <div className={localStyles.left}>
            {offer.imageUrl && (
              <div className={localStyles.heroImage}>
                <img src={offer.imageUrl} alt={offer.title} draggable={false} onDragStart={(e) => e.preventDefault()} />
              </div>
            )}
          </div>
          <div className={localStyles.right}>
            <div>
              <div className={localStyles.sectionTitle}>Résumé</div>
              <div>{offer.description}</div>
            </div>

            <div>
              <div className={localStyles.sectionTitle}>Informations</div>
              <div className={localStyles.metaGrid}>
                <div className={localStyles.metaItem}>
                  <div className={localStyles.metaLabel}>Contrat</div>
                  <div className={localStyles.metaValue}>{offer.contract || 'Non défini'}</div>
                </div>
                <div className={localStyles.metaItem}>
                  <div className={localStyles.metaLabel}>Expérience</div>
                  <div className={localStyles.metaValue}>{offer.experience || 'Non défini'}</div>
                </div>
                <div className={localStyles.metaItem}>
                  <div className={localStyles.metaLabel}>Salaire</div>
                  <div className={localStyles.metaValue}>{offer.salary ? `€ ${offer.salary}` : 'Non défini'}</div>
                </div>
                <div className={localStyles.metaItem}>
                  <div className={localStyles.metaLabel}>Télétravail</div>
                  <div className={localStyles.metaValue}>{offer.teletravail ? 'Possible' : 'Non'}</div>
                </div>
                <div className={localStyles.metaItem}>
                  <div className={localStyles.metaLabel}>Disponibilité</div>
                  <div className={localStyles.metaValue}>{offer.isAvailable ? 'Disponible' : 'Indisponible'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={localStyles.sectionTitle}>Compétences</div>
          <div className={localStyles.chips}>
            {(offer.skills || []).map((s: string) => (
              <div key={s} className={localStyles.chip}>{s}</div>
            ))}
          </div>
        </div>

        {(offer.location || offer.latitude) && (
          <div className={localStyles.locationBlock}>
            Localisation: {offer.location || `${offer.latitude}, ${offer.longitude}`}
          </div>
        )}

        {offer.latitude && offer.longitude && (
          <div className={localStyles.mapWrapper}>
            <OfferCandidateMap candidates={[]} offer={offer} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetail;
