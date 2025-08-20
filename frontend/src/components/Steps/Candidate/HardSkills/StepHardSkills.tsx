import React, { useState } from 'react';
import styles from './StepHardSkills.module.scss';
import { LucideProps } from 'lucide-react';
import { X } from 'lucide-react';

const experienceLevels = ['Débutant', 'Junior', 'Intermédiaire', 'Senior', 'Expert'];

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepHardSkills: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => {
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = () => {
        const skillToAdd = newSkill.trim();
        if (skillToAdd) {
            const currentSkills = data.hardSkills || [];
            if (!currentSkills.includes(skillToAdd)) {
                updateData({ hardSkills: [...currentSkills, skillToAdd] });
                setNewSkill('');
            }
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        const currentSkills = data.hardSkills || [];
        const updatedSkills = currentSkills.filter((skill: string) => skill !== skillToRemove);
        updateData({ hardSkills: updatedSkills });
    };

    const handleExperienceLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateData({ experience: e.target.value });
    };

    const showError = !data.experience && data._showValidationError;

    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Compétences techniques</h3>
                <p>Vos expertises techniques</p>
            </div>
            <div className={styles.skillsContent}>
                <div className={styles.skillsInput}>
                    <input
                        type="text"
                        placeholder="Ex: React, Python, Photoshop..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    />
                    <button type="button" className={styles.addButton} onClick={handleAddSkill}>+</button>
                </div>
                <div className={styles.skillsList}>
                    {(data.hardSkills || []).map((skill: string) => (
                        <div key={skill} className={styles.skillTag}>
                            {skill}
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => handleRemoveSkill(skill)}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={styles.experienceLevelSelect}>
                    <label htmlFor="experience">
                        Niveau d'expérience technique <span style={{color:'#dc2626'}}>*</span>
                    </label>
                    <select
                        id="experience"
                        name="experience"
                        value={data.experience || ''}
                        onChange={handleExperienceLevelChange}
                        required
                    >
                        <option value="">Niveau d'expérience</option>
                        {experienceLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                    {showError && (
                        <span className={styles.errorText}>
                            Le niveau d'expérience technique est obligatoire.
                        </span>
                    )}
                </div>
            </div>
        </>
    );
};

export default StepHardSkills;