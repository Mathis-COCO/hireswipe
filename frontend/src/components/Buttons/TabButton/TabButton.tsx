import React from 'react';
import styles from './TabButton.module.scss';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <div
      className={`${styles.tabButton} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default TabButton;