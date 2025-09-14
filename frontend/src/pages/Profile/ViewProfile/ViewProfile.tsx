import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { userService } from '../../../services/userService';
import styles from '../Profile.module.scss';
import OfferCandidateMap from '../../../components/Maps/OfferCandidateMap.tsx/OfferCandidateMap';
import AppNavigation from '../../../components/AppNavigation/AppNavigation';
import { authService } from '../../../services/authService';
import { offerService } from '../../../services/offerService';

const ListRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <span className={styles.label}>{label}</span>
    <div>{children}</div>
  </div>
);

const ViewProfile: React.FC<{ userId?: string }> = ({ userId: propId }) => {
  const params = useParams();
  const id = propId ?? (params as any).id;
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState<any | null>(null);
  const [accountType, setAccountType] = useState<'candidat' | 'entreprise' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
        const data = await userService.getUserById(id);
        if (mounted) setProfile(data);
        
        try {
          const me = await authService.getCurrentUser();
          if (mounted) setAccountType(me?.role === 'candidat' ? 'candidat' : 'entreprise');
        } catch (err) {
          
        }
      } catch (err) {
        
        console.error('Failed to load profile', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const maybeOfferId = (location && (location as any).state && (location as any).state.offerId) || null;
        if (!maybeOfferId) return;
        const data = await offerService.getOfferById(Number(maybeOfferId));
        if (mounted) setOffer(data);
  } catch (err) {
  }
    })();
    return () => { mounted = false; };
  }, [location]);

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!profile) return <div className={styles.loading}>Profil introuvable</div>;

  const isCandidate = profile.role === 'candidat';

  const lat = profile.latitude ?? profile.companyLat ?? null;
  const lng = profile.longitude ?? profile.companyLng ?? null;

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileCard}>
        <div className={styles.topBar}>
          <div className={styles.leftAction}>
            <button
              type="button"
              onClick={() => navigate('/messages')}
              className={`${styles.backBtn} ${styles.topActionBtn} ${styles.primary}`}
              aria-label="Retour aux matchs"
            >
              ← Retour
            </button>
          </div>
          <div className={styles.actions}>
            {profile.email && (
              <a
                href={`mailto:${encodeURIComponent(profile.email)}?subject=${encodeURIComponent('Match Hireswipe !')}`}
                className={`${styles.contactBtn} ${styles.topActionBtn} ${styles.primary}`}
                aria-label={`Contacter ${profile.email}`}
              >
                Contacter
              </a>
            )}
            {offer && offer.id && (
              <button type="button" className={`${styles.offerLink} ${styles.topActionBtn} ${styles.ghost}`} onClick={() => navigate(`/mes-offres/${offer.id}`)}>
                Voir l'annonce
              </button>
            )}
          </div>
        </div>
        <div className={styles.header}>
          <img
            src={profile.profilePhotoUrl || profile.profilePhoto || '/logo192.png'}
            alt="Profil"
            className={styles.logo}
          />
          <div>
            <h2 className={styles.companyName}>
              {isCandidate ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : profile.companyName}
            </h2>
            <p className={styles.sector}>{isCandidate ? profile.jobTitle : profile.sector}</p>
          </div>
        </div>
        
        
        {offer && (
          <div className={styles.offerSummary}>
            <h3 className={styles.offerTitle}>{offer.title || offer.name || 'Annonce'}</h3>
            <div className={styles.offerMeta}>
              <span>{offer.contractType || offer.type || ''}</span>
              {offer.salary && <span> • {offer.salary}</span>}
            </div>
            <p className={styles.offerExcerpt}>{offer.description ? (offer.description.length > 160 ? offer.description.slice(0, 157) + '...' : offer.description) : ''}</p>
          </div>
        )}

        <div className={styles.infoGrid}>
          <ListRow label="Email :">{profile.email}</ListRow>
          <ListRow label="Téléphone :">{profile.phone || '—'}</ListRow>
          <ListRow label={isCandidate ? 'Localisation :' : 'Adresse :'}>{profile.candidateLocationAddress || profile.companyAddress || '—'}</ListRow>
          <ListRow label="Bio / Pitch :">{profile.bio || profile.pitch || '—'}</ListRow>
          {!isCandidate && <ListRow label="Taille de l'entreprise :">{profile.companySize || '—'}</ListRow>}
          {!isCandidate && <ListRow label="Site web :">{profile.website ? <a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a> : '—'}</ListRow>}
          {!isCandidate && <ListRow label="LinkedIn :">{profile.linkedinUrl ? <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">{profile.linkedinUrl}</a> : '—'}</ListRow>}

          {isCandidate && (
            <>
              <ListRow label="Expérience :">{profile.experience || '—'}</ListRow>
              <ListRow label="Salaire attendu :">{profile.salary || '—'}</ListRow>
              <ListRow label="Types de contrats :">{Array.isArray(profile.contractTypes) ? profile.contractTypes.join(', ') : (profile.contractTypes || '—')}</ListRow>
              <ListRow label="Modes de travail :">{Array.isArray(profile.workModes) ? profile.workModes.join(', ') : (profile.workModes || '—')}</ListRow>
              <ListRow label="Hard skills :">{Array.isArray(profile.hardSkills) ? profile.hardSkills.join(', ') : (profile.hardSkills || '—')}</ListRow>
              <ListRow label="Soft skills :">{Array.isArray(profile.softSkills) ? profile.softSkills.join(', ') : (profile.softSkills || '—')}</ListRow>
              <ListRow label="Langues :">{Array.isArray(profile.languages) ? profile.languages.map((l: any) => `${l.language}${l.level ? ' ('+l.level+')' : ''}`).join(', ') : (profile.languages || '—')}</ListRow>
              <ListRow label="Permis / Licences :">{Array.isArray(profile.licenseList) ? profile.licenseList.join(', ') : (profile.licenseList || '—')}</ListRow>
            </>
          )}

          {!isCandidate && (
            <>
              <ListRow label="Valeurs :">{Array.isArray(profile.values) ? profile.values.join(', ') : (profile.values || '—')}</ListRow>
              <ListRow label="Avantages / Benefits :">{Array.isArray(profile.benefits) ? profile.benefits.join(', ') : (profile.benefits || '—')}</ListRow>
            </>
          )}
        </div>
          {lat && lng && (
          <div style={{ height: 320, marginTop: '1rem' }}>
            <OfferCandidateMap
              candidates={[profile]}
              offer={{ latitude: lat, longitude: lng, title: isCandidate ? profile.jobTitle : profile.companyName }}
            />
          </div>
        )}
      </div>
        {}
        <AppNavigation accountType={accountType} />
    </div>
  );
};

export default ViewProfile;
