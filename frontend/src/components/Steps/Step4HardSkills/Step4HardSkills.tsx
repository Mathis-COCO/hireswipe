import React from 'react';
import styles from './Step4HardSkills.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
}

const Step4HardSkills: React.FC<StepProps> = ({ icon: Icon }) => (
    <>
        <div className={styles.stepHeader}>
            <div className={styles.iconContainer}><Icon /></div>
            <h3>Compétences techniques</h3>
            <p>Vos expertises techniques</p>
        </div>
        <div className={styles.skillsContent}>
            <div className={styles.skillsInput}>
                <input type="text" placeholder="Ex: React, Python, Photoshop..." />
                <button type="button" className={styles.addButton}>+</button>
            </div>
            <div className={styles.skillsList}>
                <div className={styles.skillTag}>JavaScript</div>
                <div className={styles.skillTag}>Python</div>
                <div className={styles.skillTag}>React</div>
                <div className={styles.skillTag}>Node.js</div>
                <div className={styles.skillTag}>SQL</div>
                <div className={styles.skillTag}>Git</div>
                <div className={styles.skillTag}>Docker</div>
                <div className={styles.skillTag}>AWS</div>
            </div>
        </div>
    </>
);

export default Step4HardSkills;