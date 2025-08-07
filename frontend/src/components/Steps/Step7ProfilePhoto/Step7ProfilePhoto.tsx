import React from 'react';
import styles from './Step7ProfilePhoto.module.scss';
import { LucideProps } from 'lucide-react';
import { Upload } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
}

const Step7ProfilePhoto: React.FC<StepProps> = ({ icon: Icon }) => (
    <>
        <div className={styles.stepHeader}>
            <div className={styles.iconContainer}><Icon /></div>
            <h3>Photo de profil</h3>
            <p>Ajoutez votre photo (optionnel)</p>
        </div>
        <div className={styles.uploadSection}>
            <div className={styles.uploadBox}>
                <div className={styles.uploadIcon}><Upload size={48} /></div>
                <span>Glissez votre photo ici</span>
                <small>Format recommandé : JPG, PNG (max. 5MB)</small>
                <button type="button" className={styles.uploadButton}>Choisir une photo</button>
            </div>
        </div>
        <div className={styles.formGroup}>
            <label htmlFor="bio">Bio (optionnel)</label>
            <textarea id="bio" placeholder="Décrivez-vous en quelques mots..."></textarea>
        </div>
    </>
);

export default Step7ProfilePhoto;