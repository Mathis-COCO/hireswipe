import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import styles from './SortButton.module.scss';

type SortButtonProps = {
  sort: 'asc' | 'desc';
  onToggle: () => void;
};

const SortButton: React.FC<SortButtonProps> = ({ sort, onToggle }) => (
  <button className={styles.sortBtn} onClick={onToggle} title="Changer l'ordre de tri">
    {sort === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
    <span className={styles.sortLabel}>{sort === 'asc' ? 'Ancien' : 'Récent'}</span>
  </button>
);

export default SortButton;
