import React from 'react';
import styles from './ProgressIndicator.module.scss';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepTitles: string[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
    currentStep, 
    totalSteps, 
    stepTitles 
}) => {
    return (
        <div className={styles.progressIndicator}>
            <div className={styles.header}>
                <h3 className={styles.title}>Configuration du profil</h3>
                <p className={styles.subtitle}>Étape {currentStep} sur {totalSteps}</p>
                
                {/* Barre de progression déplacée ici */}
                <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBar} style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
                </div>
            </div>
            
            <div className={styles.stepsList}>
                {stepTitles.map((title, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    
                    return (
                        <div 
                            key={index}
                            className={`${styles.stepItem} ${
                                isCompleted ? styles.completed : 
                                isCurrent ? styles.current : 
                                styles.pending
                            }`}
                        >
                            <div className={styles.stepIcon}>
                                {isCompleted ? (
                                    <Check size={16} />
                                ) : (
                                    <span className={styles.stepNumber}>{stepNumber}</span>
                                )}
                            </div>
                            <span className={styles.stepTitle}>{title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressIndicator;
