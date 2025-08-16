import React from 'react';
import styles from './LicenseSelector.module.scss';
import { Car, Bike, Truck, Bus, Ship } from 'lucide-react';

interface License {
  code: string;
  description: string;
  icon: React.ComponentType;
  iconClass: string;
}

const licenses: License[] = [
  { code: 'Permis A1', description: 'Motocyclettes légères (125 cm³)', icon: Bike, iconClass: 'motorcycle' },
  { code: 'Permis A2', description: 'Motocs de puissance intermédiaire', icon: Bike, iconClass: 'motorcycle' },
  { code: 'Permis A', description: 'Toutes les motocyclettes', icon: Bike, iconClass: 'motorcycle' },
  { code: 'Permis B', description: 'Véhicules légers (voitures)', icon: Car, iconClass: 'car' },
  { code: 'Permis BE', description: 'Voiture avec remorque', icon: Car, iconClass: 'car' },
  { code: 'Permis C1', description: 'Camions jusqu\'à 7,5 tonnes', icon: Truck, iconClass: 'truck' },
  { code: 'Permis C', description: 'Poids lourds', icon: Truck, iconClass: 'truck' },
  { code: 'Permis D1', description: 'Minibus', icon: Bus, iconClass: 'bus' },
  { code: 'Permis D', description: 'Autobus et autocars', icon: Bus, iconClass: 'bus' },
  { code: 'Permis bateau', description: 'Embarcations de plaisance', icon: Ship, iconClass: 'boat' },
];

interface LicenseSelectorProps {
  selectedLicenses: string[];
  onLicenseChange: (licenses: string[]) => void;
}

const LicenseSelector: React.FC<LicenseSelectorProps> = ({ selectedLicenses, onLicenseChange }) => {
  const handleLicenseToggle = (licenseCode: string) => {
    const newSelection = selectedLicenses.includes(licenseCode)
      ? selectedLicenses.filter(code => code !== licenseCode)
      : [...selectedLicenses, licenseCode];
    
    onLicenseChange(newSelection);
  };

  return (
    <div className={styles.licenseSection}>
      <div className={styles.licenseGrid}>
        {licenses.map((license) => {
          const IconComponent = license.icon;
          const isSelected = selectedLicenses.includes(license.code);
          
          return (
            <div
              key={license.code}
              className={`${styles.licenseItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleLicenseToggle(license.code)}
            >
              <div className={styles.licenseCheckbox}></div>
              <div className={`${styles.licenseIcon} ${styles[license.iconClass]}`}>
                <IconComponent />
              </div>
              <div className={styles.licenseInfo}>
                <div className={styles.licenseCode}>{license.code}</div>
                <div className={styles.licenseDescription}>{license.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LicenseSelector;