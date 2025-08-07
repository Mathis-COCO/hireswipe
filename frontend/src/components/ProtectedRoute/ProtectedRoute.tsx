import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedOnboardingProps {
    children: React.ReactNode;
}

const ProtectedOnboarding: React.FC<ProtectedOnboardingProps> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        // Si pas connecté, rediriger vers auth
        if (!token) {
            navigate('/auth');
            return;
        }

        // Si onboarding déjà terminé, rediriger vers la page d'accueil
        const isCompleted = localStorage.getItem('onboardingCompleted');
        if (isCompleted === 'true') {
            navigate('/');
            return;
        }
    }, [navigate]);

    return <>{children}</>;
};

export default ProtectedOnboarding;
