import React from 'react';
import styles from './SwipeTutorial.module.scss';

interface Props {
  onClose: () => void;
}

const SwipeTutorial: React.FC<Props> = ({ onClose }) => {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <h3 className={styles.title}>Comment ça marche</h3>
        <p className={styles.lead}>Balaye à droite pour aimer, à gauche pour passer. Tu peux aussi utiliser les boutons en bas.</p>

        <ul className={styles.steps}>
          <li>
            <div className={styles.dot}>1</div>
            <div>
              <div className={styles.stepTitle}>Swipe</div>
              <div className={styles.stepText}>Déplace la carte vers la droite pour aimer, vers la gauche pour refuser.</div>
            </div>
          </li>
          <li>
            <div className={styles.dot}>2</div>
            <div>
              <div className={styles.stepTitle}>Boutons</div>
              <div className={styles.stepText}>Utilise les icônes en bas si tu préfères cliquer.</div>
            </div>
          </li>
          <li>
            <div className={styles.dot}>3</div>
            <div>
              <div className={styles.stepTitle}>Infos</div>
              <div className={styles.stepText}>Toujours visible : info de l'entreprise, lieu et tags utiles.</div>
            </div>
          </li>
        </ul>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={onClose}>J'ai compris</button>
          <button className={styles.ghost} onClick={onClose}>Passer</button>
        </div>
      </div>
    </div>
  );
};

export default SwipeTutorial;
