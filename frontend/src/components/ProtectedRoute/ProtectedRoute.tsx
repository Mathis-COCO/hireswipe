import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

interface ProtectedOnboardingProps {
    children: React.ReactNode;
}

const ProtectedOnboarding: React.FC<ProtectedOnboardingProps> = ({ children }) => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    interface UserCheckOnboarding {
        firstName?: string;
        companyName?: string;
        role?: string;
    }
    
    const [user, setUser] = useState<UserCheckOnboarding | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await authService.getCurrentUser();
            setUser(user);
            setIsCompleted(!!(user?.firstName || user?.companyName));
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const checkAccess = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/auth', { replace: true });
                return;
            }

            if (isCompleted === true) {
                setIsChecking(false);
                navigate('/', { replace: true });
                return;
            }

            if (!user?.role) {
                localStorage.removeItem('authToken');
                navigate('/auth', { replace: true });
                return;
            }

            setIsChecking(false);
        };

        checkAccess();
    }, [navigate, isCompleted]);

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
