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
            console.debug('[ProtectedOnboarding] checkAccess - token:', token);
            if (!token) {
                navigate('/auth', { replace: true });
                return;
            }

            const isCompleted = localStorage.getItem('onboardingCompleted');
            if (isCompleted === 'true') {
                setIsChecking(false);
                navigate('/', { replace: true });
                localStorage.removeItem('onboardingCompleted');
                return;
            }

            try {
                const user = await import('../../services/authService').then(m => m.authService.getCurrentUser());
                if (!user || !user.role) {
                    console.debug('[ProtectedOnboarding] getCurrentUser failed or returned no role, removing token');
                    localStorage.removeItem('authToken');
                    navigate('/auth', { replace: true });
                    return;
                }
            } catch (e) {
                console.debug('[ProtectedOnboarding] getCurrentUser threw:', e);
                localStorage.removeItem('authToken');
                navigate('/auth', { replace: true });
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
