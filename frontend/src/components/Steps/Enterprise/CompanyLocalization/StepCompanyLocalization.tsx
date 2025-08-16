import React from 'react';
import styles from './StepCompanyLocalization.module.scss';
import { LucideProps } from 'lucide-react';
import InteractiveMap from '../../../InteractiveMap/InteractiveMap';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepCompanyLocalization: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => {
    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Localisation de l'entreprise</h3>
                <p>Où est située votre entreprise ?</p>
            </div>
            
            <div className={styles.mapSection}>
                <InteractiveMap 
                    initialLatitude={data.companyLat}
                    initialLongitude={data.companyLng}
                    onLocationChange={(newLocation) => updateData({
                        companyAddress: newLocation.address,
                        companyLat: newLocation.lat,
                        companyLng: newLocation.lng
                    })}
                />
            </div>
            
            <div className={styles.formGroup}>
                <label>Taille de l'entreprise</label>
                <select
                    value={data.employees || ''}
                    onChange={(e) => updateData({ employees: e.target.value })}
                >
                    <option value="" disabled>Sélectionner le nombre d'employés</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501+">501+</option>
                </select>
            </div>
        </>
    );
};

export default StepCompanyLocalization;