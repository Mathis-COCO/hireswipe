import React, { useState, useEffect } from 'react';
import styles from './StepLocalization.module.scss';
import { LucideProps } from 'lucide-react';
import LicenseSelector from '../../../LicenseSelector/LicenseSelector';
import InteractiveMap from '../../../InteractiveMap/InteractiveMap';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepLocalization: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => {
    const [mobility, setMobility] = useState(data.mobility || '');
    const [licenseList, setLicensesList] = useState(data.licenseList || []);

    useEffect(() => {
        updateData({
            mobility,
            licenseList
        });
    }, [mobility, licenseList]);

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
                        value={mobility}
                        onChange={(e) => setMobility(e.target.value)}
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label>Permis de conduire</label>
                    <LicenseSelector 
                        selectedLicenses={licenseList}
                        onLicenseChange={setLicensesList}
                    />
                </div>
            </form>
        </>
    );
};

export default StepLocalization;