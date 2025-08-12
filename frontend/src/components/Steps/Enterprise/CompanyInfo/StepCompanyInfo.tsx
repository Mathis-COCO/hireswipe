import React from 'react';
import styles from './StepCompanyInfo.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepCompanyInfo: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => {
    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Informations entreprise</h3>
                <p>Présentez votre entreprise</p>
            </div>
            <form>
                <div className={styles.formGroup}>
                    <label htmlFor="companyName">Nom de l'entreprise</label>
                    <input
                        id="companyName"
                        type="text"
                        placeholder="Ma Super Entreprise"
                        defaultValue={data.companyName || ''}
                        onChange={(e) => updateData({ companyName: e.target.value })}
                    />
                    <p className={styles.infoText}>
                        <small>Si vous êtes auto-entrepreneur, vous pouvez saisir votre nom.</small>
                    </p>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="companyDescription">Description (optionnel)</label>
                    <textarea
                        id="companyDescription"
                        placeholder="Présentez votre entreprise en quelques mots..."
                        defaultValue={data.companyDescription || ''}
                        onChange={(e) => updateData({ companyDescription: e.target.value })}
                    ></textarea>
                </div>
            </form>
        </>
    );
};

export default StepCompanyInfo;