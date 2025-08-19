import React from 'react';
import styles from './OfferList.module.scss';
import { Eye, Pencil, Trash2, Users } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

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
  publishedAt: string;
  candidates: any[];
  isAvailable: boolean;
}

interface OfferListProps {
  offers: Offer[];
  onDelete: (id: string) => void;
}

const getCityFromLocation = (location: string) => {
  if (!location) return '';
  return location.split(',')[0].trim();
};

const OfferList: React.FC<OfferListProps> = ({ offers, onDelete }) => {
  const navigate = useNavigate();

  const handleEditClick = (offer: Offer) => {
    navigate(`/mes-offres/${offer.id}/edit`);
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
                  {o.location && <span>{getCityFromLocation(o.location)}</span> }
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
                <button title="Voir" className={styles.iconBtn}>
                  <Eye size={20} />
                </button>
                <button title="Modifier" onClick={() => handleEditClick(o)} className={styles.iconBtn}>
                  <Pencil size={20} />
                </button>
                <button title="Supprimer" onClick={() => onDelete(o.id)} className={styles.iconBtn}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className={styles.offerDesc}>{o.description}</div>
            <div className={styles.offerFooterRow}>
              <div className={styles.offerFooterInfos}>
                <div className={styles.inlineMeta}>
                  <span className={styles.published}>Publié le {o.publishedAt}</span>
                  <span className={styles.candidates}>{o.candidates.length} candidature{o.candidates.length > 1 ? 's' : ''}</span>
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
