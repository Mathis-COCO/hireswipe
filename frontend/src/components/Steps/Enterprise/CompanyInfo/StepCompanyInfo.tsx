import React, { useState, useEffect } from 'react';
import styles from './StepCompanyInfo.module.scss';
import { Building2, Users, Globe } from 'lucide-react';

interface CompanyInfoProps {
  icon: React.ComponentType;
  data: any;
  updateData: (data: any) => void;
}

const StepCompanyInfo: React.FC<CompanyInfoProps> = ({ icon: Icon, data, updateData }) => {
  const [formData, setFormData] = useState({
    companyName: data.companyName || '',
    companySize: data.companySize || ''
  });

  const [showErrors, setShowErrors] = useState(false);

  const companySizeOptions = [
    '1-10 employés',
    '11-50 employés',
    '51-200 employés',
    '201-1000 employés',
    '1000+ employés'
  ];

  const getErrors = () => ({
    companyName: !formData.companyName.trim(),
    companySize: !formData.companySize
  });

  const validateForm = () => {
    const errors = getErrors();
    return !Object.values(errors).some(error => error);
  };

  useEffect(() => {
    const isValid = validateForm();
    updateData({ 
      ...formData, 
      _isValid: isValid,
      _onValidationError: () => setShowErrors(true)
    });
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    if (showErrors) {
      setShowErrors(false);
    }
  };

  const errors = getErrors();

  return (
    <>
      <div className="icon">
        <Building2 />
      </div>
      
      <h2>Informations de l'entreprise</h2>
      <p>Commençons par les informations de base de votre entreprise</p>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="companyName" className={showErrors && errors.companyName ? styles.errorLabel : ''}>
            <div><Building2 size={18} color={showErrors && errors.companyName ? "#dc2626" : "#3b82f6"} /></div>
            <span>Nom de l'entreprise *</span>
          </label>
          <input
            type="text"
            id="companyName"
            placeholder="Nom de votre entreprise"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className={showErrors && errors.companyName ? styles.errorInput : ''}
            required
          />
          {showErrors && errors.companyName && <span className={styles.errorText}>Ce champ est obligatoire</span>}
        </div>

        <div className="form-group">
          <label className={showErrors && errors.companySize ? styles.errorLabel : ''}>
            <div><Users size={18} color={showErrors && errors.companySize ? "#dc2626" : "#3b82f6"} /></div>
            <span>Taille de l'entreprise *</span>
          </label>
          <div className={styles.sizeOptions}>
            {companySizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                className={`${styles.sizeOption} ${formData.companySize === size ? styles.selected : ''}`}
                onClick={() => handleInputChange('companySize', size)}
              >
                {size}
              </button>
            ))}
          </div>
          {showErrors && errors.companySize && <span className={styles.errorText}>Veuillez sélectionner une taille d'entreprise</span>}
        </div>
      </div>
    </>
  );
};

export default StepCompanyInfo;