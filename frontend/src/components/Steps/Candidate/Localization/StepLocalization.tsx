import React from 'react';
import styles from './StepLocalization.module.scss';
import { LucideProps } from 'lucide-react';
import LicenseSelector from '../../../LicenseSelector/LicenseSelector';
import InteractiveMap from '../../../InteractiveMap/InteractiveMap';
import { MapPin } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepLocalization: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => {
    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Localisation & Mobilité</h3>
                <p>Où souhaitez-vous travailler et quelle est votre mobilité ?</p>
            </div>
            
            <div className={styles.mapSection}>
                <InteractiveMap 
                    initialLatitude={data.candidateLocationLat}
                    initialLongitude={data.candidateLocationLng}
                    onLocationChange={(newLocation) => updateData({
                        candidateLocationAddress: newLocation.address,
                        candidateLocationLat: newLocation.lat,
                        candidateLocationLng: newLocation.lng
                    })}
                />
            </div>
            
            <form>
                <div className={styles.formGroup}>
                    <label htmlFor="mobility">Mobilité géographique</label>
                    <input
                        id="mobility"
                        type="text"
                        placeholder="Votre mobilité"
                        defaultValue={data.mobility || ''}
                        onChange={(e) => updateData({ mobility: e.target.value })}
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label>Permis de conduire</label>
                    <LicenseSelector 
                        selectedLicenses={data.licenses || []}
                        onLicenseChange={(newLicenses) => updateData({ licenses: newLicenses })}
                    />
                </div>
            </form>
        </>
    );
};

export default StepLocalization;