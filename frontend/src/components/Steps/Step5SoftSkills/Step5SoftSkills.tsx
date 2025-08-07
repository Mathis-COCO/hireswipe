import React from 'react';
import styles from './Step5SoftSkills.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
}

const Step5SoftSkills: React.FC<StepProps> = ({ icon: Icon }) => (
    <>
        <div className={styles.stepHeader}>
            <div className={styles.iconContainer}><Icon /></div>
            <h3>Compétences comportementales</h3>
            <p>Vos qualités humaines</p>
        </div>
        <div className={styles.skillsContent}>
            <div className={styles.skillsInput}>
                <input type="text" placeholder="Ex: Leadership, Créativité, Empathie..." />
                <button type="button" className={styles.addButton}>+</button>
            </div>
            <div className={styles.skillsList}>
                <div className={styles.skillTag}>Leadership</div>
                <div className={styles.skillTag}>Créativité</div>
                <div className={styles.skillTag}>Empathie</div>
                <div className={styles.skillTag}>Adaptabilité</div>
                <div className={styles.skillTag}>Communication</div>
                <div className={styles.skillTag}>Esprit d'équipe</div>
                <div className={styles.skillTag}>Autonomie</div>
                <div className={styles.skillTag}>Rigueur</div>
            </div>
        </div>
    </>
);

export default Step5SoftSkills;