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
import StepCompanyPitch from '../../components/Steps/Enterprise/CompanyPitch/StepCompanyPitch';
import { authService } from '../../services/authService';

const Onboarding: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [profileData, setProfileData] = useState<any>({});
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
    const [accountType, setAccountType] = useState<'candidat' | 'entreprise' | null>(null);
    const navigate = useNavigate();
    const candidateSteps: number = 8;
    const companySteps: number = 6;
    const totalSteps = accountType === 'entreprise' ? companySteps : candidateSteps;

    useEffect(() => {
        authService.getCurrentUser().then(userData => {
            if (userData.firstName || userData.companyName) {
                navigate('/');
            } else {
                navigate('/onboarding');
            }
        });

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

        const storedAccountType = localStorage.getItem('accountType') as 'candidat' | 'entreprise' | null;
        if (!storedAccountType) {
            navigate('/auth');
            return;
        }

        setAccountType(storedAccountType);

        const savedProgress = localStorage.getItem('onboardingProgress');
        if (savedProgress) {
            try {
                const { step: savedStep, data } = JSON.parse(savedProgress);
                setStep(savedStep || 1);
                setProfileData({ ...data, accountType: storedAccountType });
            } catch (error) {
                setProfileData({ accountType: storedAccountType });
            }
        } else {
            setProfileData({ accountType: storedAccountType });
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
        const isCurrentStepValid = validateCurrentStep();
        if (!isCurrentStepValid) {
            if (profileData._onValidationError) {
                profileData._onValidationError();
            }
            return;
        }

        if (step < totalSteps && !isTransitioning) {
            setIsTransitioning(true);
            setAnimationDirection('right');
            setTimeout(() => {
                const newStep = step + 1;
                setStep(newStep);
                if (step !== totalSteps - 1) {
                    saveProgress(newStep, profileData);
                }
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 100);
            }, 300);
        }
    };

    const handleNextButtonClick = (): void => {
        const isCurrentStepValid = validateCurrentStep();
        if (!isCurrentStepValid) {
            if (profileData._onValidationError) {
                profileData._onValidationError();
            }
            return;
        }
        nextStep();
    };

    const validateCurrentStep = (): boolean => {
        if (accountType === 'entreprise') {
            switch (step) {
                case 1:
                    return !!(profileData.companyName?.trim() && profileData.companySize);
                case 2:
                    return !!(profileData.sector);
                case 3:
                    return !!(profileData.companyAddress);
                case 4:
                    return !!(profileData.pitch?.trim());
                default:
                    return true;
            }
        } else {
            switch (step) {
                case 1:
                    return !!(profileData.firstName?.trim() && profileData.lastName?.trim() && profileData.jobTitle?.trim());
                case 2:
                    return !!(profileData.candidateLocationAddress);
                case 3:
                    return !!(profileData.workExperiences?.trim());
                case 4:
                    return !!(profileData.hardSkills && profileData.hardSkills.length > 0);
                case 5:
                    return !!(profileData.softSkills && profileData.softSkills.length > 0);
                case 6:
                    return !!(profileData.contractTypes && profileData.contractTypes.length > 0);
                default:
                    return true;
            }
        }
    };

    const isNextButtonDisabled = (): boolean => {
        return isTransitioning || !validateCurrentStep();
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
        const newData = { ...profileData, ...stepData, accountType };
        setProfileData(newData);
    };

    const completeOnboarding = async () => {
        try {
            await authService.updateProfile(profileData);
            localStorage.setItem('onboardingCompleted', 'true');
            localStorage.removeItem('onboardingProgress');

            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la finalisation:', error);
        }
    };

    const renderStep = (): React.ReactElement | null => {
        if (!accountType) return null;

        if (accountType === 'entreprise') {
            switch (step) {
                case 1:
                    return <CompanyInfo icon={Building2} data={profileData} updateData={updateProfileData} />;
                case 2:
                    return <CompanyDetails icon={Briefcase} data={profileData} updateData={updateProfileData} />;
                case 3:
                    return <CompanyLocalization icon={MapPin} data={profileData} updateData={updateProfileData} />;
                case 4:
                    return <StepCompanyPitch icon={Globe} data={profileData} updateData={updateProfileData} />;
                case 5:
                    return <Step7ProfilePhoto icon={Camera} data={profileData} updateData={updateProfileData} />;
                case 6:
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
        if (accountType === 'entreprise') {
            return [
                'Informations entreprise',
                'Détails',
                'Localisation',
                'Présentation entreprise',
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

    if (!accountType) {
        return (
            <div className={styles.onboardingWrapper}>
                <div className={styles.onboardingContainer}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <p>Chargement...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                            {renderStep()}
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
                            onClick={handleNextButtonClick}
                            className={`${styles.navButton} ${styles.next} ${isNextButtonDisabled() ? styles.disabled : ''}`}
                            disabled={false}
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