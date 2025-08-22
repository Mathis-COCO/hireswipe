import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { offerService } from '../../services/offerService';
import { authService } from '../../services/authService';
import styles from './Messages.module.scss';

const Messages: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await offerService.getMatches();
        if (!mounted) return;
        const currentUser = await authService.getCurrentUser();
        const currentRole = currentUser?.role;
        // show only opposite-role users
        const filtered = (data || []).filter((u: any) => u.role && u.role !== currentRole);
        setMatches(filtered);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load matches', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <h2>Messagerie — Chargement...</h2>;

  const handleClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className={styles.messagesContainer}>
      <h2>Messagerie</h2>
      {matches.length === 0 ? (
        <p>Aucun match pour le moment</p>
      ) : (
        <ul className={styles.matchList}>
          {matches.map((m) => (
            <li key={m.id} className={styles.matchItem} onClick={() => handleClick(m.id)} role="button" tabIndex={0}>
              <img src={m.profilePhoto || '/logo192.png'} alt={`${m.firstName || ''} ${m.lastName || ''}`} className={styles.avatar} />
              <div>
                <div className={styles.name}>{`${m.firstName || ''} ${m.lastName || ''}`.trim() || m.email}</div>
                <div className={styles.subtitle}>{m.role}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
