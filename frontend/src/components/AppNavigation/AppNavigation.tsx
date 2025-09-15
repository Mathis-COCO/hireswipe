import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { hasUnsavedChanges } from '../../utils/unsavedChanges';
import styles from './AppNavigation.module.scss';
import { Home, MessageCircle, Heart, User, PlusSquare, Briefcase, ClipboardList } from 'lucide-react';

const candidateNav = [
  { label: 'Accueil', icon: Home, path: '/' },
  { label: 'Messagerie', icon: MessageCircle, path: '/messages' },
  { label: 'Likes envoyés', icon: Heart, path: '/likes' },
  { label: 'Profil', icon: User, path: '/profile' },
];

const recruiterNav = [
  
  { label: 'Messagerie', icon: MessageCircle, path: '/messages' },
  { label: 'Ajouter offre', icon: PlusSquare, path: '/ajouter-offre' },
  { label: 'Mes offres', icon: ClipboardList, path: '/mes-offres' },
  { label: 'Profil', icon: Briefcase, path: '/profile' },
];

interface AppNavigationProps {
  accountType: 'candidat' | 'entreprise' | null;
}

const AppNavigation: React.FC<AppNavigationProps> = ({ accountType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = accountType === 'entreprise' ? recruiterNav : candidateNav;

  return (
    <nav className={styles.appNav}>
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => {
              if (hasUnsavedChanges()) {
                const ok = window.confirm('Vous avez des modifications en cours. Si vous changez de page vous perdrez votre progression. Continuer ?');
                if (!ok) return;
              }
              navigate(item.path);
            }}
            type="button"
          >
            <Icon size={24} />
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default AppNavigation;
