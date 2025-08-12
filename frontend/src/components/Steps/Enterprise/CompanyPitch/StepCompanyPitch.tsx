import React, { useState } from 'react';
import styles from './StepCompanyPitch.module.scss';
import { MessageCircle, Target, Award } from 'lucide-react';

interface StepCompanyPitchProps {
  icon: React.ComponentType;
  data: any;
  updateData: (data: any) => void;
}

const StepCompanyPitch: React.FC<StepCompanyPitchProps> = ({ icon: Icon, data, updateData }) => {
  const [formData, setFormData] = useState({
    pitch: data.pitch || '',
    values: data.values || '',
    benefits: data.benefits || [],
    workEnvironment: data.workEnvironment || ''
  });

  const benefitOptions = [
    'Télétravail possible',
    'Horaires flexibles',
    'Formation continue',
    'Prime de performance',
    'Mutuelle d\'entreprise',
    'Restaurant d\'entreprise',
    'Salle de sport',
    'Conciergerie',
    'Crèche d\'entreprise',
    'Véhicule de fonction',
    'Stock-options',
    'RTT supplémentaires'
  ];

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData(newData);
  };

  const handleBenefitToggle = (benefit: string) => {
    const currentBenefits = formData.benefits || [];
    const updatedBenefits = currentBenefits.includes(benefit)
      ? currentBenefits.filter((b: string) => b !== benefit)
      : [...currentBenefits, benefit];
    
    handleInputChange('benefits', updatedBenefits);
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.icon}>
        <MessageCircle />
      </div>
      
      <h2>Présentez votre entreprise</h2>
      <p>Donnez envie aux talents de rejoindre votre équipe</p>

      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label htmlFor="pitch">
            <Target size={18} />
            Pitch de l'entreprise *
          </label>
          <textarea
            id="pitch"
            placeholder="Décrivez votre entreprise, votre mission, vos projets... (maximum 500 caractères)"
            value={formData.pitch}
            onChange={(e) => handleInputChange('pitch', e.target.value)}
            maxLength={500}
            rows={4}
          />
          <span className={styles.charCount}>{formData.pitch.length}/500</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="values">
            <Award size={18} />
            Valeurs et culture d'entreprise
          </label>
          <textarea
            id="values"
            placeholder="Quelles sont vos valeurs ? Quelle est l'ambiance de travail chez vous ?"
            value={formData.values}
            onChange={(e) => handleInputChange('values', e.target.value)}
            maxLength={300}
            rows={3}
          />
          <span className={styles.charCount}>{formData.values.length}/300</span>
        </div>

        <div className={styles.formGroup}>
          <label>Avantages proposés</label>
          <div className={styles.benefitsGrid}>
            {benefitOptions.map((benefit) => (
              <button
                key={benefit}
                type="button"
                className={`${styles.benefitTag} ${formData.benefits.includes(benefit) ? styles.selected : ''}`}
                onClick={() => handleBenefitToggle(benefit)}
              >
                {benefit}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCompanyPitch;