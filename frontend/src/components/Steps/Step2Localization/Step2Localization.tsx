import React, { useState } from 'react';
import styles from './Step2Localization.module.scss';
import { LucideProps } from 'lucide-react';
import LicenseSelector from '../../LicenseSelector/LicenseSelector';

interface StepProps {
    icon: React.ElementType<LucideProps>;
}

const Step2Localization: React.FC<StepProps> = ({ icon: Icon }) => {
    const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);

    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Localisation & Mobilité</h3>
                <p>Où souhaitez-vous travailler et quelle est votre mobilité ?</p>
            </div>
            <form>
                <div className={`${styles.formGroup} ${styles.row}`}>
                    <div className={styles.formField}>
                        <label htmlFor="city">Ville</label>
                        <input id="city" type="text" placeholder="Paris" defaultValue="Paris" />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="country">Pays</label>
                        <input id="country" type="text" placeholder="France" defaultValue="France" />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="mobility">Mobilité géographique</label>
                    <input id="mobility" type="text" placeholder="Votre mobilité" />
                </div>
                
                <div className={styles.formGroup}>
                    <label>Permis de conduire</label>
                    <LicenseSelector 
                        selectedLicenses={selectedLicenses}
                        onLicenseChange={setSelectedLicenses}
                    />
                </div>
            </form>
        </>
    );
};

export default Step2Localization;