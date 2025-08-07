import React from 'react';
import styles from './Step8Summary.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
}

const Step8Summary: React.FC<StepProps> = ({ icon: Icon }) => (
    <>
        <div className={styles.stepHeader}>
            <div className={styles.iconContainer}><Icon /></div>
            <h3>Récapitulatif</h3>
            <p>Vérifiez vos informations</p>
        </div>
        <div className={styles.summarySection}>
            <h4>Informations personnelles</h4>
            <p>Nom, Prénom : Jean Dupont, 28 ans</p>
            <p>Poste recherché : Développeur Full Stack</p>
        </div>
        <div className={styles.summarySection}>
            <h4>Compétences</h4>
            <p>Techniques : JavaScript, React, etc.</p>
            <p>Comportementales : Leadership, Créativité, etc.</p>
        </div>
        <div className={styles.summarySection}>
            <h4>Préférences</h4>
            <p>Salaire : 45000 €/an</p>
            <p>Contrats : CDI, CDD</p>
            <p>Modes : Télétravail</p>
        </div>
    </>
);

export default Step8Summary;