import React, { useState } from 'react';
import { Building2, Users, Globe } from 'lucide-react';

interface CompanyInfoProps {
  icon: React.ComponentType;
  data: any;
  updateData: (data: any) => void;
}

const StepCompanyInfo: React.FC<CompanyInfoProps> = ({ icon: Icon, data, updateData }) => {
  const [formData, setFormData] = useState({
    companyName: data.companyName || '',
    website: data.website || '',
    linkedinUrl: data.linkedinUrl || ''
  });
  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData(newData);
  };

  return (
    <>
      <div className="icon">
        <Building2 />
      </div>
      
      <h2>Informations de l'entreprise</h2>
      <p>Commençons par les informations de base de votre entreprise</p>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="companyName">
            <div><Building2 size={18} color="#3b82f6" /></div>
            <span>Nom de l'entreprise *</span>
          </label>
          <input
            type="text"
            id="companyName"
            placeholder="Nom de votre entreprise"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">
            <div><Globe size={18} color="#3b82f6" /></div>
            <span>Site web</span>
          </label>
          <input
            type="url"
            id="website"
            placeholder="https://www.votreentreprise.com"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedinUrl">
            <span>LinkedIn de l'entreprise</span>
          </label>
          <input
            type="url"
            id="linkedinUrl"
            placeholder="https://www.linkedin.com/company/votre-entreprise"
            value={formData.linkedinUrl}
            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default StepCompanyInfo;