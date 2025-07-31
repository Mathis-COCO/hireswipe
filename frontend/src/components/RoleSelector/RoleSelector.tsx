import React from 'react';
import styles from './RoleSelector.module.scss';
import { Users, Building2, Heart } from 'lucide-react'

interface RoleSelectorProps {
  selectedRole: 'candidat' | 'entreprise';
  onSelectRole: (role: 'candidat' | 'entreprise') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole }) => {
  return (
    <div className={styles.roleSelection}>
      <label className={styles.label}>Je suis :</label>
      <div
        className={`${styles.roleOption} ${selectedRole === 'candidat' ? styles.selected : ''}`}
        onClick={() => onSelectRole('candidat')}
      >
        <div className={styles.radioCustom}></div>
        <div className={styles.roleIcon}>
          <Users color="#3b82f6" />
        </div>
        <div className={styles.roleInfo}>
          <div className={styles.roleTitle}>Candidat</div>
          <div className={styles.roleDescription}>Je cherche un emploi</div>
        </div>
      </div>
      <div
        className={`${styles.roleOption} ${selectedRole === 'entreprise' ? styles.selected : ''}`}
        onClick={() => onSelectRole('entreprise')}
      >
        <div className={styles.radioCustom}></div>
        <div className={styles.roleIcon}>
          <Building2 color="#49a53dff" />
        </div>
        <div className={styles.roleInfo}>
          <div className={styles.roleTitle}>Entreprise</div>
          <div className={styles.roleDescription}>Je recrute des talents</div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;