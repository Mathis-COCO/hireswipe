import React, { useState } from 'react';
import styles from './StepExperience.module.scss';
import { LucideProps } from 'lucide-react';
import { Trash2 } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepExperience: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => {
    const [newLanguage, setNewLanguage] = useState({ language: '', level: '' });

    const handleAddLanguage = () => {
        if (newLanguage.language && newLanguage.level) {
            const currentLanguages = data.languages || [];
            updateData({ languages: [...currentLanguages, newLanguage] });
            setNewLanguage({ language: '', level: '' });
        }
    };

    const handleRemoveLanguage = (indexToRemove: number) => {
        const currentLanguages = data.languages || [];
        const updatedLanguages = currentLanguages.filter((_: { language: string; level: string }, index: number) => index !== indexToRemove);
        updateData({ languages: updatedLanguages });
    };

    const languageLevels = ['Débutant', 'Intermédiaire', 'Avancé', 'Bilingue', 'Maternel'];

    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Expérience</h3>
                <p>Votre parcours professionnel</p>
            </div>
            <form>
                <div className={styles.formGroup}>
                    <label htmlFor="workExperiences">Expériences professionnelles</label>
                    <textarea
                        id="workExperiences"
                        placeholder="Décrivez vos expériences les plus significatives..."
                        defaultValue={data.workExperiences || ''}
                        onChange={(e) => updateData({ workExperiences: e.target.value })}
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="education">Formation et études</label>
                    <textarea
                        id="education"
                        placeholder="Vos diplômes, certifications, formations..."
                        defaultValue={data.education || ''}
                        onChange={(e) => updateData({ education: e.target.value })}
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label>Langues</label>
                    <div className={styles.langList}>
                        {(data.languages || []).map((lang: any, index: number) => (
                            <div key={index} className={styles.langItem}>
                                <span>{lang.language} - {lang.level}</span>
                                <button type="button" onClick={() => handleRemoveLanguage(index)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.langField}>
                        <input
                            type="text"
                            placeholder="Langue"
                            value={newLanguage.language}
                            onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
                        />
                        <select
                            value={newLanguage.level}
                            onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
                        >
                            <option value="" disabled>Niveau</option>
                            {languageLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                        <button type="button" className={styles.addButton} onClick={handleAddLanguage}>+</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default StepExperience;