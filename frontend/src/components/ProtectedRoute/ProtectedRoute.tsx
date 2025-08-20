import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

interface ProtectedOnboardingProps {
    children: React.ReactNode;
}

const ProtectedOnboarding: React.FC<ProtectedOnboardingProps> = ({ children }) => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
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

            const accountType = localStorage.getItem('accountType');
            if (!accountType) {
                localStorage.removeItem('authToken');
                navigate('/auth');
                return;
            }

            setIsChecking(false);
        };

        checkAccess();
    }, [navigate]);

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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
};

export default ProtectedOnboarding;
export { ProtectedRoute };
