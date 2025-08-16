import React from 'react';
import styles from './StepCompanyDetails.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepCompanyDetails: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => {
    const employeeOptions = [
        '1-10 employés',
        '11-50 employés',
        '51-200 employés',
        '201-500 employés',
        '500+ employés',
    ];

    const [formData, setFormData] = React.useState({
        sector: data.sector || '',
        employees: data.employees || '',
        website: data.website || '',
        linkedinUrl: data.linkedinUrl || ''
    });

    React.useEffect(() => {
        updateData(formData);
    }, [formData]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Détails</h3>
                <p>Secteur et liens externes</p>
            </div>
            <form>
                <div className={styles.formGroup}>
                    <label htmlFor="sector">Secteur d'activité</label>
                    <select
                        id="sector"
                        value={formData.sector}
                        onChange={(e) => handleInputChange('sector', e.target.value)}
                    >
                        <option value="" disabled>Choisissez votre secteur</option>
                        <option value="IT">Informatique</option>
                        <option value="finance">Finance</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="website">
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
                <div className={styles.formGroup}>
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
            </form>
        </>
    );
};

export default StepCompanyDetails;