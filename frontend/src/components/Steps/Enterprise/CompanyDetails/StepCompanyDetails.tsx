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

    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Détails</h3>
                <p>Secteur et taille</p>
            </div>
            <form>
                <div className={styles.formGroup}>
                    <label htmlFor="sector">Secteur d'activité</label>
                    <select
                        id="sector"
                        defaultValue={data.sector || ''}
                        onChange={(e) => updateData({ sector: e.target.value })}
                    >
                        <option value="" disabled>Choisissez votre secteur</option>
                        <option value="IT">Informatique</option>
                        <option value="finance">Finance</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="employees">Taille de l'entreprise</label>
                    <select
                        id="employees"
                        defaultValue={data.employees || ''}
                        onChange={(e) => updateData({ employees: e.target.value })}
                    >
                        <option value="" disabled>Nombre d'employés</option>
                        {employeeOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </form>
        </>
    );
};

export default StepCompanyDetails;