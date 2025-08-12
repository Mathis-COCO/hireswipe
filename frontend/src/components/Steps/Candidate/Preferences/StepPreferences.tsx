import React from 'react';
import styles from './StepPreferences.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepPreferences: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => {
    const handleContractToggle = (contract: string) => {
        const currentContracts = data.contractTypes || [];
        const updatedContracts = currentContracts.includes(contract)
            ? currentContracts.filter((contractType: string) => contractType !== contract)
            : [...currentContracts, contract];
        updateData({ contractTypes: updatedContracts });
    };

    const handleWorkModeToggle = (mode: string) => {
        const currentWorkModes = data.workModes || [];
        const updatedWorkModes = currentWorkModes.includes(mode)
            ? currentWorkModes.filter((workMode: string) => workMode !== mode)
            : [...currentWorkModes, mode];
        updateData({ workModes: updatedWorkModes });
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
                    <input
                        id="salary"
                        type="number"
                        placeholder="45000"
                        defaultValue={data.salary || ''}
                        onChange={(e) => updateData({ salary: parseInt(e.target.value) || '' })}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Types de contrats souhaités</label>
                    <div className={styles.toggleOptions}>
                        {contracts.map(contract => (
                            <button
                                type="button"
                                key={contract}
                                onClick={() => handleContractToggle(contract)}
                                className={`${styles.toggleOption} ${data.contractTypes?.includes(contract) ? styles.active : ''}`}
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
                                className={`${styles.toggleOption} ${data.workModes?.includes(mode) ? styles.active : ''}`}
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

export default StepPreferences;