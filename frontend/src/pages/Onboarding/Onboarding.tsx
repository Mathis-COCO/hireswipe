import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Onboarding.module.scss';
import { User, MapPin, Briefcase, Code, HeartHandshake, Car, DollarSign, Camera, Check } from 'lucide-react';
import Step1Personal from '../../components/Steps/Step1Personal/Step1Personal';
import Step2Localization from '../../components/Steps/Step2Localization/Step2Localization';
import Step3Experience from '../../components/Steps/Step3Experience/Step3Experience';
import Step4TechSkills from '../../components/Steps/Step4HardSkills/Step4HardSkills';
import Step5SoftSkills from '../../components/Steps/Step5SoftSkills/Step5SoftSkills';
import Step6Preferences from '../../components/Steps/Step6Preferences/Step6Preferences';
import Step7ProfilePhoto from '../../components/Steps/Step7ProfilePhoto/Step7ProfilePhoto';
import Step8Summary from '../../components/Steps/Step8Summary/Step8Summary';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';

const Onboarding: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [profileData, setProfileData] = useState<any>({});
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
    const totalSteps: number = 8;
    const navigate = useNavigate();

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

    const stepTitles = [
        'Informations personnelles',
        'Localisation & Mobilité',
        'Expérience professionnelle',
        'Compétences techniques',
        'Compétences humaines',
        'Préférences',
        'Photo de profil',
        'Résumé'
    ];

    const renderStep = (): React.ReactElement | null => {
        switch (step) {
            case 1:
                return <Step1Personal icon={User} />;
            case 2:
                return <Step2Localization icon={MapPin} />;
            case 3:
                return <Step3Experience icon={Briefcase} />;
            case 4:
                return <Step4TechSkills icon={Code} />;
            case 5:
                return <Step5SoftSkills icon={HeartHandshake} />;
            case 6:
                return <Step6Preferences icon={DollarSign} />;
            case 7:
                return <Step7ProfilePhoto icon={Camera} />;
            case 8:
                return <Step8Summary icon={Check} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.onboardingWrapper}>
            <ProgressIndicator 
                currentStep={step} 
                totalSteps={totalSteps} 
                stepTitles={stepTitles}
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