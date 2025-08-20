import React from 'react';
import styles from './StepCompanyLocalization.module.scss';
import { LucideProps } from 'lucide-react';
import InteractiveMap from '../../../Maps/InteractiveMap/InteractiveMap';

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
        </>
    );
};

export default StepCompanyLocalization;