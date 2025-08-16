import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedOnboardingProps {
    children: React.ReactNode;
}

const ProtectedOnboarding: React.FC<ProtectedOnboardingProps> = ({ children }) => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            const token = localStorage.getItem('authToken');
            
            // Si pas connecté, rediriger vers auth
            if (!token) {
                navigate('/auth');
                return;
            }

            // Vérifier si l'onboarding est déjà terminé
            const isCompleted = localStorage.getItem('onboardingCompleted');
            if (isCompleted === 'true') {
                navigate('/');
                return;
            }

            // Vérifier si on a un type de compte
            const accountType = localStorage.getItem('accountType');
            if (!accountType) {
                // Si pas de type de compte, rediriger vers auth pour re-login
                localStorage.removeItem('authToken');
                navigate('/auth');
                return;
            }

            setIsChecking(false);
        };

        checkAccess();
    }, [navigate]);

    // Show loading while checking
    if (isChecking) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#f0f2f5'
            }}>
                <p>Vérification des accès...</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedOnboarding;
