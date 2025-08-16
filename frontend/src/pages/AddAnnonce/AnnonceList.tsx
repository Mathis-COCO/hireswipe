import React from 'react';
import styles from './AnnonceList.module.scss';
import { Eye, Pencil, Trash2, Users } from 'lucide-react';

interface Annonce {
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

interface AnnonceListProps {
  annonces: Annonce[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onNew: () => void;
}

const AnnonceList: React.FC<AnnonceListProps> = ({ annonces, onEdit, onDelete, onView, onNew }) => (
  <div className={styles.listWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div className={styles.header}>
      <h2>Mes annonces</h2>
      <p>Gérez vos offres d'emploi et suivez les candidatures</p>
      <button className={styles.newBtn} onClick={onNew}>+ Nouvelle annonce</button>
    </div>
    <div className={styles.annonces} style={{ width: '100%', maxWidth: 900 }}>
      {annonces.map(a => (
        <div key={a.id} className={styles.annonceCard}>
          <div className={styles.annonceHeader}>
            <div>
              <span className={styles.annonceTitle}>{a.title}</span>
              <div className={styles.annonceMeta}>
                <span>{a.location}</span>
                {a.teletravail && <span className={styles.teletravailTag}>Télétravail</span>}
                <span>€ {a.salary}</span>
                <span>{a.experience}</span>
              </div>
            </div>
            <div className={styles.annonceActions}>
              <button title="Voir" onClick={() => onView(a.id)} className={styles.iconBtn}>
                <Eye size={20} />
              </button>
              <button title="Modifier" onClick={() => onEdit(a.id)} className={styles.iconBtn}>
                <Pencil size={20} />
              </button>
              <button title="Supprimer" onClick={() => onDelete(a.id)} className={styles.iconBtn}>
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className={styles.annonceDesc}>{a.description}</div>

          <div className={styles.annonceFooterRow}>
            <div className={styles.annonceFooterInfos}>
              <div className={styles.inlineMeta}>
                <span className={styles.published}>Publié le {a.publishedAt}</span>
                <span className={styles.candidates}>{a.candidates} candidatures</span>
                <span className={styles.contract}>{a.contract}</span>
              </div>
              <div className={styles.tagsRow}>
                {a.skills.map(s => <span key={s} className={styles.tag}>{s}</span>)}
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

export default AnnonceList;
