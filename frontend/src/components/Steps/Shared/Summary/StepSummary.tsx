import React from 'react';
import styles from './StepSummary.module.scss';
import { LucideProps } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
}

const StepSummary: React.FC<StepProps> = ({ icon: Icon, data }) => {
    const isCompany = data.accountType === 'entreprise';
    
    const formatList = (items: string[]) => {
        return items && items.length > 0 ? items.join(', ') : 'Non renseigné';
    };

    const renderCandidateSummary = () => (
        <div>
            <div className={styles.photoContainer}>
                {data.profilePhoto || data.profilePhotoUrl ? (
                    <img src={data.profilePhoto || data.profilePhotoUrl} alt="Profil" />
                ) : (
                    <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <circle cx="12" cy="8" r="3.2" fill="#E6E6E6" />
                        <rect x="6" y="13" width="12" height="6" rx="3" fill="#E6E6E6" />
                    </svg>
                )}
            </div>

            <div className={styles.infoColumn}>
                <div className={styles.summarySection}>
                    <h4>Informations personnelles</h4>
                    <div className={styles.row}><span className={styles.label}>Nom</span><span className={styles.value}>{data.lastName || 'Non renseigné'}</span></div>
                    <div className={styles.row}><span className={styles.label}>Prénom</span><span className={styles.value}>{data.firstName || 'Non renseigné'}</span></div>
                    <div className={styles.row}><span className={styles.label}>Poste recherché</span><span className={styles.value}>{data.jobTitle || 'Non renseigné'}</span></div>
                    {data.bio && <div className={styles.row}><span className={styles.label}>Bio</span><span className={styles.value}>{data.bio}</span></div>}
                </div>

                <div className={styles.summarySection}>
                    <h4>Localisation</h4>
                    <div className={styles.row}><span className={styles.label}>Adresse</span><span className={styles.value}>{data.candidateLocationAddress || 'Non renseigné'}</span></div>
                </div>

                <div className={styles.summarySection}>
                    <h4>Compétences</h4>
                    <div className={styles.row}><span className={styles.label}>Techniques</span><span className={styles.value}>{formatList(data.hardSkills)}</span></div>
                    <div className={styles.row}><span className={styles.label}>Comportementales</span><span className={styles.value}>{formatList(data.softSkills)}</span></div>
                </div>

                <div className={styles.summarySection}>
                    <h4>Préférences</h4>
                    <div className={styles.row}><span className={styles.label}>Salaire</span><span className={styles.value}>{data.salary ? `${data.salary} €/an` : 'Non renseigné'}</span></div>
                    <div className={styles.row}><span className={styles.label}>Contrats</span><span className={styles.value}>{formatList(data.contractTypes)}</span></div>
                    <div className={styles.row}><span className={styles.label}>Modes</span><span className={styles.value}>{formatList(data.workModes)}</span></div>
                </div>
            </div>
        </div>
    );

    const renderCompanySummary = () => (
        <div>
            <div className={styles.photoContainer}>
                {data.companyLogo || data.profilePhotoUrl ? (
                    <img src={data.companyLogo || data.profilePhotoUrl} alt="Logo de l'entreprise" />
                ) : (
                    <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <rect x="4" y="6" width="16" height="12" rx="2" fill="#E6E6E6" />
                    </svg>
                )}
            </div>

            <div className={styles.infoColumn}>
                <div className={styles.summarySection}>
                    <h4>Informations sur l'entreprise</h4>
                    <div className={styles.row}><span className={styles.label}>Nom</span><span className={styles.value}>{data.companyName || 'Non renseigné'}</span></div>
                    <div className={styles.row}><span className={styles.label}>Description</span><span className={styles.value}>{data.companyDescription || 'Non renseigné'}</span></div>
                </div>

                <div className={styles.summarySection}>
                    <h4>Détails</h4>
                    <div className={styles.row}><span className={styles.label}>Secteur</span><span className={styles.value}>{data.sector || 'Non renseigné'}</span></div>
                    <div className={styles.row}><span className={styles.label}>Employés</span><span className={styles.value}>{data.employees || 'Non renseigné'}</span></div>
                </div>

                <div className={styles.summarySection}>
                    <h4>Localisation</h4>
                    <div className={styles.row}><span className={styles.label}>Adresse</span><span className={styles.value}>{data.companyAddress || 'Non renseigné'}</span></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.stepContainer}>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Récapitulatif</h3>
                <p>Vérifiez vos informations</p>
            </div>
            
            {isCompany ? renderCompanySummary() : renderCandidateSummary()}
        </div>
    );
};

export default StepSummary;