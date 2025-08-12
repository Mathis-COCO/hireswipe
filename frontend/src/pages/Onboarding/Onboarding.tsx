import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Onboarding.module.scss';
import { User, MapPin, Briefcase, Code, HeartHandshake, DollarSign, Camera, Check, Building2, Globe } from 'lucide-react';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';
import Step1Personal from '../../components/Steps/Candidate/Personal/StepPersonal';
import Step2Localization from '../../components/Steps/Candidate/Localization/StepLocalization';
import Step3Experience from '../../components/Steps/Candidate/Experience/StepExperience';
import Step4HardSkills from '../../components/Steps/Candidate/HardSkills/StepHardSkills';
import Step5SoftSkills from '../../components/Steps/Candidate/SoftSkills/StepSoftSkills';
import Step6Preferences from '../../components/Steps/Candidate/Preferences/StepPreferences';
import Step7ProfilePhoto from '../../components/Steps/Shared/ProfilePhoto/StepProfilePhoto';
import Step8Summary from '../../components/Steps/Shared/Summary/StepSummary';
import CompanyInfo from '../../components/Steps/Enterprise/CompanyInfo/StepCompanyInfo';
import CompanyDetails from '../../components/Steps/Enterprise/CompanyDetails/StepCompanyDetails';
import CompanyLocalization from '../../components/Steps/Enterprise/CompanyLocalization/StepCompanyLocalization';

const Onboarding: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [profileData, setProfileData] = useState<any>({});
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
    const navigate = useNavigate();

    const candidateSteps: number = 8;
    const companySteps: number = 5;

    const accountType = profileData.accountType || 'candidate';

    const totalSteps = accountType === 'company' ? companySteps : candidateSteps;

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/auth');
            return;
        }

        const isCompleted = localStorage.getItem('onboardingCompleted');
        if (isCompleted === 'true') {
            navigate('/');
            return;
        }

        const savedProgress = localStorage.getItem('onboardingProgress');
        if (savedProgress) {
            try {
                const { step: savedStep, data } = JSON.parse(savedProgress);
                setStep(savedStep || 1);
                setProfileData(data || {});
            } catch (error) {
                console.error('Erreur lors du chargement de la progression:', error);
            }
        }
    }, [navigate]);

    const saveProgress = (currentStep: number, data: any) => {
        const progressData = {
            step: currentStep,
            data: data,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('onboardingProgress', JSON.stringify(progressData));
    };

    const nextStep = (): void => {
        if (step < totalSteps && !isTransitioning) {
            setIsTransitioning(true);
            setAnimationDirection('right');
            setTimeout(() => {
                const newStep = step + 1;
                setStep(newStep);
                saveProgress(newStep, profileData);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 100);
            }, 300);
        }
    };

    const prevStep = (): void => {
        if (step > 1 && !isTransitioning) {
            setIsTransitioning(true);
            setAnimationDirection('left');
            setTimeout(() => {
                const newStep = step - 1;
                setStep(newStep);
                saveProgress(newStep, profileData);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 100);
            }, 300);
        }
    };

    const updateProfileData = (stepData: any) => {
        const newData = { ...profileData, ...stepData };
        setProfileData(newData);
        saveProgress(step, newData);
    };

    const completeOnboarding = async () => {
        try {
            console.log('Données du profil à sauvegarder:', profileData);
            
            localStorage.setItem('onboardingCompleted', 'true');
            localStorage.removeItem('onboardingProgress');
            
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la finalisation:', error);
        }
    };

    const renderStep = (): React.ReactElement | null => {
        if (accountType === 'company') {
            switch (step) {
                case 1:
                    return <CompanyInfo icon={Building2} data={profileData} updateData={updateProfileData} />;
                case 2:
                    return <CompanyDetails icon={Briefcase} data={profileData} updateData={updateProfileData} />;
                case 3:
                    return <CompanyLocalization icon={MapPin} data={profileData} updateData={updateProfileData} />;
                case 4:
                    return <Step7ProfilePhoto icon={Camera} data={profileData} updateData={updateProfileData} />;
                case 5:
                    return <Step8Summary icon={Check} data={profileData} />;
                default:
                    return null;
            }
        } else {
            switch (step) {
                case 1:
                    return <Step1Personal icon={User} data={profileData} updateData={updateProfileData} />;
                case 2:
                    return <Step2Localization icon={MapPin} data={profileData} updateData={updateProfileData} />;
                case 3:
                    return <Step3Experience icon={Briefcase} data={profileData} updateData={updateProfileData} />;
                case 4:
                    return <Step4HardSkills icon={Code} data={profileData} updateData={updateProfileData} />;
                case 5:
                    return <Step5SoftSkills icon={HeartHandshake} data={profileData} updateData={updateProfileData} />;
                case 6:
                    return <Step6Preferences icon={DollarSign} data={profileData} updateData={updateProfileData} />;
                case 7:
                    return <Step7ProfilePhoto icon={Camera} data={profileData} updateData={updateProfileData} />;
                case 8:
                    return <Step8Summary icon={Check} data={profileData} />;
                default:
                    return null;
            }
        }
    };

    const getStepTitles = (): string[] => {
        if (accountType === 'company') {
            return [
                'Informations entreprise',
                'Détails',
                'Localisation',
                'Logo entreprise',
                'Résumé'
            ];
        } else {
            return [
                'Informations personnelles',
                'Localisation & Mobilité',
                'Expérience professionnelle',
                'Compétences techniques',
                'Compétences humaines',
                'Préférences',
                'Photo de profil',
                'Résumé'
            ];
        }
    };

    return (
        <div className={styles.onboardingWrapper}>
            <ProgressIndicator
                currentStep={step}
                totalSteps={totalSteps}
                stepTitles={getStepTitles()}
            />
            <div className={styles.onboardingContainer}>
                <main className={styles.onboardingMain}>
                    <div className={styles.formCard}>
                        <div className={`${styles.stepContent} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                            {accountType === undefined ? (
                                <div className={styles.accountTypeSelector}>
                                    <h3>Je suis :</h3>
                                    <button onClick={() => updateProfileData({ accountType: 'candidate' })}>Candidat</button>
                                    <button onClick={() => updateProfileData({ accountType: 'company' })}>Entreprise</button>
                                </div>
                            ) : (
                                renderStep()
                            )}
                        </div>
                    </div>
                </main>

                <footer className={styles.onboardingFooter}>
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className={`${styles.navButton} ${styles.prev}`}
                            disabled={isTransitioning}
                        >
                            ← Précédent
                        </button>
                    )}
                    {step < totalSteps && (
                        <button
                            onClick={nextStep}
                            className={`${styles.navButton} ${styles.next}`}
                            disabled={isTransitioning}
                        >
                            Suivant →
                        </button>
                    )}
                    {step === totalSteps && (
                        <button
                            onClick={completeOnboarding}
                            className={`${styles.navButton} ${styles.finish}`}
                            disabled={isTransitioning}
                        >
                            Terminer
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default Onboarding;