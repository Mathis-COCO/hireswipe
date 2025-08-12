import React from 'react';
import styles from './StepSummary.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
}

const StepSummary: React.FC<StepProps> = ({ icon: Icon, data }) => {
    const isCompany = data.accountType === 'company';
    
    const formatList = (items: string[]) => {
        return items && items.length > 0 ? items.join(', ') : 'Non renseigné';
    };

    const renderCandidateSummary = () => (
        <>
            <div className={styles.summarySection}>
                <h4>Informations personnelles</h4>
                {data.profilePhotoUrl && (
                    <div className={styles.photoContainer}>
                        <img src={data.profilePhotoUrl} alt="Profil" />
                    </div>
                )}
                <p>Nom, Prénom : {data.firstName || 'Non renseigné'} {data.lastName || 'Non renseigné'}</p>
                <p>Poste recherché : {data.jobTitle || 'Non renseigné'}</p>
                {data.bio && <p>Bio : {data.bio}</p>}
            </div>
            
            <div className={styles.summarySection}>
                <h4>Localisation</h4>
                <p>Adresse : {data.candidateLocationAddress || 'Non renseigné'}</p>
            </div>

            <div className={styles.summarySection}>
                <h4>Compétences</h4>
                <p>Techniques : {formatList(data.hardSkills)}</p>
                <p>Comportementales : {formatList(data.softSkills)}</p>
            </div>
            
            <div className={styles.summarySection}>
                <h4>Préférences</h4>
                <p>Salaire : {data.salary ? `${data.salary} €/an` : 'Non renseigné'}</p>
                <p>Contrats : {formatList(data.contractTypes)}</p>
                <p>Modes : {formatList(data.workModes)}</p>
            </div>
        </>
    );

    const renderCompanySummary = () => (
        <>
            <div className={styles.summarySection}>
                <h4>Informations sur l'entreprise</h4>
                {data.profilePhotoUrl && (
                    <div className={styles.photoContainer}>
                        <img src={data.profilePhotoUrl} alt="Logo de l'entreprise" />
                    </div>
                )}
                <p>Nom : {data.companyName || 'Non renseigné'}</p>
                <p>Description : {data.companyDescription || 'Non renseigné'}</p>
            </div>

            <div className={styles.summarySection}>
                <h4>Détails</h4>
                <p>Secteur d'activité : {data.sector || 'Non renseigné'}</p>
                <p>Nombre d'employés : {data.employees || 'Non renseigné'}</p>
            </div>
            
            <div className={styles.summarySection}>
                <h4>Localisation</h4>
                <p>Adresse : {data.companyAddress || 'Non renseigné'}</p>
            </div>
        </>
    );

    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Récapitulatif</h3>
                <p>Vérifiez vos informations</p>
            </div>
            
            {isCompany ? renderCompanySummary() : renderCandidateSummary()}
        </>
    );
};

export default StepSummary;