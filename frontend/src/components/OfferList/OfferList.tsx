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
  candidates: number;
}

interface OfferListProps {
  offers: Offer[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const getCityFromLocation = (location: string) => {
  if (!location) return '';
  return location.split(',')[0].trim();
};


const OfferList: React.FC<OfferListProps> = ({ offers, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();

  const handleNewClick = () => {
    navigate('/ajouter-offre');
  };

  return (
    <div className={styles.listWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className={styles.header}>
        <h2>Mes offres</h2>
        <p>Gérez vos offres d'emploi et suivez les candidatures</p>
        <button className={styles.newBtn} onClick={handleNewClick}>+ Nouvelle offre</button>
      </div>
      <div className={styles.offers} style={{ width: '100%', maxWidth: 900 }}>
        {offers.map(o => (
          <div key={o.id} className={styles.offerCard}>
            <div className={styles.offerHeader}>
              <div>
                <span className={styles.offerTitle}>{o.title}</span>
                <div className={styles.offerMeta}>
                  <span>{getCityFromLocation(o.location)}</span>
                  {o.teletravail && <span className={styles.teletravailTag}>Télétravail</span>}
                  <span>€ {o.salary}</span>
                  <span>{o.experience}</span>
                </div>
              </div>
              <div className={styles.offerActions}>
                <button title="Voir" onClick={() => onView(o.id)} className={styles.iconBtn}>
                  <Eye size={20} />
                </button>
                <button title="Modifier" onClick={() => onEdit(o.id)} className={styles.iconBtn}>
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
                  <span className={styles.candidates}>{o.candidates} candidatures</span>
                  <span className={styles.contract}>{o.contract}</span>
                </div>
                <div className={styles.tagsRow}>
                  {o.skills.map(s => <span key={s} className={styles.tag}>{s}</span>)}
                </div>
              </div>
              <button className={styles.candidatesBtn}>
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
