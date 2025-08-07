import React, { useState } from 'react';
import styles from './Step6Preferences.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
}

const Step6Preferences: React.FC<StepProps> = ({ icon: Icon }) => {
    const [selectedContracts, setSelectedContracts] = useState<string[]>(['CDI']);
    const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>(['Télétravail']);

    const handleContractToggle = (contract: string) => {
        setSelectedContracts(prev =>
            prev.includes(contract) ? prev.filter(c => c !== contract) : [...prev, contract]
        );
    };

    const handleWorkModeToggle = (mode: string) => {
        setSelectedWorkModes(prev =>
            prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
        );
    };

    const contracts = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'];
    const workModes = ['Présentiel', 'Télétravail', 'Hybride'];

    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Préférences</h3>
                <p>Vos attentes professionnelles</p>
            </div>
            <form>
                <div className={styles.formGroup}>
                    <label htmlFor="salary">Prétentions salariales (€/an)</label>
                    <input id="salary" type="number" placeholder="45000" defaultValue="45000" />
                </div>
                <div className={styles.formGroup}>
                    <label>Types de contrats souhaités</label>
                    <div className={styles.toggleOptions}>
                        {contracts.map(contract => (
                            <button
                                type="button"
                                key={contract}
                                onClick={() => handleContractToggle(contract)}
                                className={`${styles.toggleOption} ${selectedContracts.includes(contract) ? styles.active : ''}`}
                            >
                                {contract}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Modes de travail</label>
                    <div className={styles.toggleOptions}>
                        {workModes.map(mode => (
                            <button
                                type="button"
                                key={mode}
                                onClick={() => handleWorkModeToggle(mode)}
                                className={`${styles.toggleOption} ${selectedWorkModes.includes(mode) ? styles.active : ''}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </form>
        </>
    );
};

export default Step6Preferences;