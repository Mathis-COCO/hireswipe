import React from 'react';
import styles from './StepPersonal.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepPersonal: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => (
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
                    <input
                        id="firstName"
                        type="text"
                        placeholder="Jean"
                        defaultValue={data.firstName || ''}
                        onChange={(e) => updateData({ firstName: e.target.value })}
                    />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="lastName">Nom</label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Dupont"
                        defaultValue={data.lastName || ''}
                        onChange={(e) => updateData({ lastName: e.target.value })}
                    />
                </div>
            </div>
            <div className={`${styles.formGroup} ${styles.row}`}>
                <div className={styles.formField}>
                    <label htmlFor="age">Âge</label>
                    <input
                        id="age"
                        type="number"
                        placeholder="28"
                        defaultValue={data.age || ''}
                        onChange={(e) => updateData({ age: parseInt(e.target.value) || '' })}
                    />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="phone">Téléphone (optionnel)</label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        defaultValue={data.phone || ''}
                        onChange={(e) => updateData({ phone: e.target.value })}
                    />
                </div>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="jobTitle">Poste recherché</label>
                <input
                    id="jobTitle"
                    type="text"
                    placeholder="Développeur Full Stack"
                    defaultValue={data.jobTitle || ''}
                    onChange={(e) => updateData({ jobTitle: e.target.value })}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="bio">Bio (optionnel)</label>
                <textarea
                    id="bio"
                    placeholder="Parlez-nous de vous en quelques lignes"
                    defaultValue={data.bio || ''}
                    onChange={(e) => updateData({ bio: e.target.value })}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="linkedinUrl">LinkedIn (optionnel)</label>
                <input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://www.linkedin.com/in/username"
                    defaultValue={data.linkedinUrl || ''}
                    onChange={(e) => updateData({ linkedinUrl: e.target.value })}
                />
            </div>
        </form>
    </>
);

export default StepPersonal;