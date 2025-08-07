import React from 'react';
import styles from './Step3Experience.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
}

const Step3Experience: React.FC<StepProps> = ({ icon: Icon }) => (
    <>
        <div className={styles.stepHeader}>
            <div className={styles.iconContainer}><Icon /></div>
            <h3>Expérience</h3>
            <p>Votre parcours professionnel</p>
        </div>
        <form>
            <div className={styles.formGroup}>
                <label htmlFor="workExperiences">Expériences professionnelles</label>
                <textarea id="workExperiences" placeholder="Décrivez vos expériences les plus significatives..."></textarea>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="education">Formation et études</label>
                <textarea id="education" placeholder="Vos diplômes, certifications, formations..."></textarea>
            </div>
            <div className={styles.formGroup}>
                <label>Langues</label>
                <div className={styles.langField}>
                    <input type="text" placeholder="Langue" />
                    <select>
                        <option>Niveau</option>
                    </select>
                    <button type="button" className={styles.addButton}>+</button>
                </div>
            </div>
        </form>
    </>
);

export default Step3Experience;