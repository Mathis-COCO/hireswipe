import React from 'react';
import styles from './Step1Personal.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
}

const Step1Personal: React.FC<StepProps> = ({ icon: Icon }) => (
    <>
        <div className={styles.stepHeader}>
            <div className={styles.iconContainer}><Icon /></div>
            <h3>Informations personnelles</h3>
            <p>Parlez-nous de vous</p>
        </div>
        <form>
            <div className={`${styles.formGroup} ${styles.row}`}>
                <div className={styles.formField}>
                    <label htmlFor="firstName">Prénom</label>
                    <input id="firstName" type="text" placeholder="Jean" defaultValue="Jean" />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="lastName">Nom</label>
                    <input id="lastName" type="text" placeholder="Dupont" defaultValue="Dupont" />
                </div>
            </div>
            <div className={`${styles.formGroup} ${styles.row}`}>
                <div className={styles.formField}>
                    <label htmlFor="age">Âge</label>
                    <input id="age" type="number" placeholder="28" defaultValue="28" />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="phone">Téléphone (optionnel)</label>
                    <input id="phone" type="tel" placeholder="+33 6 12 34 56 78" defaultValue="+33 6 12 34 56 78" />
                </div>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="jobTitle">Poste recherché</label>
                <input id="jobTitle" type="text" placeholder="Développeur Full Stack" defaultValue="Développeur Full Stack" />
            </div>
        </form>
    </>
);

export default Step1Personal;