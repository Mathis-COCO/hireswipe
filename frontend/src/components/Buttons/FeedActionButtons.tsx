import React from 'react';
import styles from './FeedActionButtons.module.scss';
import { Heart, X } from 'lucide-react';

type FeedActionButtonsProps = {
  onCross: () => void;
  onHeart: () => void;
};

const FeedActionButtons: React.FC<FeedActionButtonsProps> = ({ onCross, onHeart }) => (
  <div className={styles.actionsWrapper}>
    <button className={styles.crossBtn} title="Passer" onClick={onCross}>
      <X />
    </button>
    <button className={styles.heartBtn} title="J'aime" onClick={onHeart}>
      <Heart />
    </button>
  </div>
);

export default FeedActionButtons;
