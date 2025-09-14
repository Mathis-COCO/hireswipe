import React from 'react';
import styles from './Likes.module.scss';
import { offerService } from '../../services/offerService';
import OfferFeedCard from '../../components/Cards/OfferFeedCard/OfferFeedCard';

const Likes: React.FC = () => {
  const [likedOffers, setLikedOffers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await offerService.getCurrentUserWithInteractedOffers();

        if (process.env.NODE_ENV === 'development') {
          console.debug('[Likes] /user/me/interacted-offers response:', res);
        }

        let offers: any[] = [];

        
        if (Array.isArray(res)) {
          if (res.length === 0) {
            offers = [];
          } else if (typeof res[0] === 'object') {
            
            if ((res[0] as any).offer) {
              offers = (res as any[]).map((r) => r.offer).filter(Boolean);
            } else {
              offers = res as any[];
            }
          } else {
            
            try {
              const ids = (res as any[]).map((x) => String(x));
              const fetched = await Promise.all(
                ids.map((id) =>
                  offerService
                    .getOfferById((Number.isNaN(Number(id)) ? id : Number(id)) as any)
                      .catch((e) => {
                        
                        console.warn('[Likes] failed to fetch offer', id, e);
                        return null;
                      }),
                ),
              );
              offers = fetched.filter(Boolean) as any[];
            } catch (e) {
              offers = [];
            }
          }
        } else if (res && typeof res === 'object') {
          if (Array.isArray((res as any).appliedOffers)) {
            offers = (res as any).appliedOffers.map((r: any) => (r.offer ? r.offer : r)).filter(Boolean);
          } else if (Array.isArray((res as any).offers)) {
            offers = (res as any).offers;
          } else if (Array.isArray((res as any).interactedOfferIds)) {
            
            offers = [];
          } else {
            offers = [];
          }
        } else {
          offers = [];
        }

        if (mounted) setLikedOffers(offers);
      } catch (err: any) {
        console.error('Failed to load liked offers', err);
        if (mounted) setError('Impossible de récupérer les likes.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2>Likes envoyés</h2>
      {loading && <div className={styles.info}>Chargement...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && likedOffers.length === 0 && <div className={styles.info}>Vous n'avez encore envoyé aucun like.</div>}

  <div className={styles.grid}>
        {likedOffers.map(offer => (
          <button key={offer.id} className={styles.preview} onClick={() => setSelected(offer)}>
            {offer.imageUrl ? (
              <img src={offer.imageUrl} alt={offer.title} className={styles.thumb} />
            ) : (
              <div className={styles.thumbPlaceholder}>{(offer.createdBy?.companyName || offer.title || 'Offre').charAt(0)}</div>
            )}
            <div className={styles.previewMeta}>
              <div className={styles.previewHeader}>
                <div className={styles.previewTitle}>{offer.title}</div>
                <div className={styles.previewCompany}>{offer.createdBy?.companyName || `${offer.createdBy?.firstName || ''} ${offer.createdBy?.lastName || ''}`.trim()}</div>
              </div>
              <div className={styles.previewDetails}>
                {offer.location && <span className={styles.detail}>{offer.location}</span>}
                {offer.salary && <span className={styles.detail}>€{offer.salary}</span>}
                {offer.contract && <span className={styles.detail}>{offer.contract}</span>}
                {offer.experience && <span className={styles.detail}>{offer.experience}</span>}
              </div>
              {offer.description && <div className={styles.previewSnippet}>{String(offer.description).slice(0, 140)}{String(offer.description).length > 140 ? '…' : ''}</div>}
              {offer.skills && offer.skills.length > 0 && (
                <div className={styles.previewTags}>
                  {offer.skills.slice(0, 6).map((s: string) => (
                    <span key={s} className={styles.tag}>{s}</span>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.chevron} aria-hidden>›</div>
          </button>
        ))}
        </div>
      </div>

      {}
      {selected && (
        <div className={styles.modal} role="dialog" aria-modal="true">
          <button className={styles.close} onClick={() => setSelected(null)} aria-label="Fermer">✕</button>
          <div className={styles.modalContent}>
            <div className={styles.modalInner}>
              <OfferFeedCard offer={selected} onCross={() => { setSelected(null) }} onHeart={() => { setSelected(null) }} showActions={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Likes;
