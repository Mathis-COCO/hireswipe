import React from 'react';
import styles from './OfferList.module.scss';
import { Eye, Pencil, Users, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Offer {
  id: string;
  title: string;
  location: string;
  salary: string;
  experience: string;
  contract: string;
  teletravail: boolean;
  description: string;
  skills: string[];
  avantages: string[];
  createdAt: string;
  updatedAt: string;
  candidates: any[];
  isAvailable: boolean;
}

interface OfferListProps {
  offers: Offer[];
  onDelete: (id: string) => void;
  onToggleAvailability?: (id: string, isAvailable: boolean) => void;
}

const getCityFromLocation = (location: string) => {
  if (!location) return '';
  return location.split(',')[0].trim();
};

const OfferList: React.FC<OfferListProps> = ({ offers, onDelete, onToggleAvailability }) => {
  const navigate = useNavigate();

  const handleEditClick = (offer: Offer) => {
    navigate(`/mes-offres/${offer.id}/edit`);
  };

  const handleToggleAvailability = (offer: Offer) => {
    if (typeof onToggleAvailability !== 'function') return;

    // If we're pausing the offer (making it unavailable) and there are candidates,
    // warn the user that candidates will be deleted.
    if (offer.isAvailable && offer.candidates && offer.candidates.length > 0) {
      const ok = window.confirm('Mettre cette annonce en pause supprimera toutes les candidatures associées. Voulez-vous continuer ?');
      if (!ok) return;
    }

    onToggleAvailability(offer.id, !offer.isAvailable);
  };

  const handleViewCandidates = (offerId: string) => {
    navigate(`/mes-offres/${offerId}/candidats`);
  };

  return (
    <div className={styles.listWrapper}>
      <div className={styles.offers}>
        {offers.map(o => (
          <div key={o.id} className={styles.offerCard}>
            <div className={styles.offerHeader}>
              <div>
                <span className={styles.offerTitle}>{o.title}</span>
                <div className={styles.offerMeta}>
                  {o.location && <span>{getCityFromLocation(o.location)}</span>}
                  {o.teletravail && <span className={styles.teletravailTag}>Télétravail</span>}
                  {o.salary && <span>€ {o.salary}</span>}
                  <span>
                    {o.experience}
                    {typeof o.isAvailable !== 'undefined' && (
                      <span
                        className={
                          o.isAvailable
                            ? styles.statusAvailable
                            : styles.statusUnavailable
                        }
                        style={{ marginLeft: 8, fontWeight: 600 }}
                      >
                        {o.isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <div className={styles.offerActions}>
                <button title="Voir" onClick={() => navigate(`/mes-offres/${o.id}`)} className={styles.iconBtn}>
                  <Eye size={20} />
                </button>
                <button title="Modifier" onClick={() => handleEditClick(o)} className={styles.iconBtn}>
                  <Pencil size={20} />
                </button>
                <button
                  aria-label={o.isAvailable ? 'Désactiver l\'annonce' : 'Réactiver l\'annonce'}
                  title={o.isAvailable ? 'Désactiver l\'annonce' : 'Réactiver l\'annonce'}
                  onClick={() => handleToggleAvailability(o)}
                  className={styles.iconBtn}
                >
                  {o.isAvailable ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </div>
            </div>
            <div className={styles.offerDesc}>{o.description}</div>
            <div className={styles.offerFooterRow}>
              <div className={styles.offerFooterInfos}>
                  {o.updatedAt 
                    ? <span className={styles.published}>Publiée le {new Date(o.createdAt).toLocaleDateString('fr-FR')} à {new Date(o.createdAt).toLocaleTimeString('fr-FR')}</span> 
                    : null
                  }
                <div className={styles.inlineMeta}>
                  {o.updatedAt 
                    ? <span className={styles.published}>Mis à jour le {new Date(o.updatedAt).toLocaleDateString('fr-FR')} à {new Date(o.updatedAt).toLocaleTimeString('fr-FR')}</span> 
                    : <span className={styles.published}>Publiée le {new Date(o.createdAt).toLocaleDateString('fr-FR')} à {new Date(o.createdAt).toLocaleTimeString('fr-FR')}</span>
                  }
                  <span className={styles.candidates} style={o.candidates.length > 0 ? {color : '#007bff'} : { color: '#b80517ff' }}>{o.candidates.length} candidature{o.candidates.length > 1 ? 's' : ''}</span>
                  <span className={styles.contract}>{o.contract}</span>
                </div>
                <div className={styles.tagsRow}>
                  {o.skills.map(s => <span key={s} className={styles.tag}>{s}</span>)}
                </div>
              </div>
              <button className={styles.candidatesBtn} onClick={() => handleViewCandidates(o.id)}>
                <Users size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Voir les candidatures
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferList;
