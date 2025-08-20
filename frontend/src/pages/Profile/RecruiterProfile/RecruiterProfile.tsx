import React, { useEffect, useState } from 'react';
import styles from './RecruiterProfile.module.scss';
import { authService } from '../../../services/authService';
import OfferCandidateMap from '../../../components/Maps/OfferCandidateMap.tsx/OfferCandidateMap';
import InteractiveMap from '../../../components/Maps/InteractiveMap/InteractiveMap';

const companySizeOptions = [
    '1-10 employés',
    '11-50 employés',
    '51-200 employés',
    '201-1000 employés',
    '1000+ employés'
];

const sectorOptions = [
    'IT',
    'Finance',
    'Marketing',
    'RH',
    'Santé',
    'Éducation',
    'Industrie',
    'Commerce',
    'Autre'
];

const RecruiterProfile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    // For dynamic lists
    const [valuesInput, setValuesInput] = useState('');
    const [benefitInput, setBenefitInput] = useState('');

    useEffect(() => {
        authService.getCurrentUser().then(setProfile);
    }, []);

    useEffect(() => {
        if (isEditing && profile) {
            setEditData({
                ...profile,
                values: Array.isArray(profile.values) ? profile.values : (profile.values ? [profile.values] : []),
                benefits: Array.isArray(profile.benefits) ? profile.benefits : (profile.benefits ? [profile.benefits] : [])
            });
            setValuesInput('');
            setBenefitInput('');
        }
    }, [isEditing, profile]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (field: string, value: any) => {
        setEditData((prev: any) => ({ ...prev, [field]: value }));
    };

    // List management for values and benefits
    const handleAddValue = () => {
        if (valuesInput.trim()) {
            setEditData((prev: any) => ({
                ...prev,
                values: [...(prev.values || []), valuesInput.trim()]
            }));
            setValuesInput('');
        }
    };

    const handleRemoveValue = (idx: number) => {
        setEditData((prev: any) => ({
            ...prev,
            values: prev.values.filter((_: string, i: number) => i !== idx)
        }));
    };

    const handleAddBenefit = () => {
        if (benefitInput.trim()) {
            setEditData((prev: any) => ({
                ...prev,
                benefits: [...(prev.benefits || []), benefitInput.trim()]
            }));
            setBenefitInput('');
        }
    };

    const handleRemoveBenefit = (idx: number) => {
        setEditData((prev: any) => ({
            ...prev,
            benefits: prev.benefits.filter((_: string, i: number) => i !== idx)
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await authService.updateProfile(editData);
            setProfile(editData);
            setIsEditing(false);
        } catch (err) {
            // Optionally show error
        }
        setLoading(false);
    };

    // Ajout pour la gestion de la localisation
    const handleMapChange = (loc: { address: string; lat: number; lng: number }) => {
        setEditData((prev: any) => ({
            ...prev,
            companyAddress: loc.address,
            companyLat: loc.lat,
            companyLng: loc.lng
        }));
    };

    if (!profile) {
        return (
            <div className={styles.loading}>
                <p>Chargement du profil...</p>
            </div>
        );
    }

    return (
        <div className={styles.profileWrapper}>
            <div className={styles.profileCard}>
                <div className={styles.header}>
                    <img
                        src={profile.companyLogo || profile.profilePhotoUrl || ''}
                        alt="Logo"
                        className={styles.logo}
                    />
                    <div>
                        <h2 className={styles.companyName}>{profile.companyName}</h2>
                        <p className={styles.sector}>{profile.sector}</p>
                    </div>
                </div>
                <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                    {!isEditing && (
                        <button className={styles.editBtn} onClick={handleEditClick}>
                            Modifier le profil
                        </button>
                    )}
                </div>
                {isEditing ? (
                    <form className={styles.editForm} onSubmit={e => { e.preventDefault(); handleSave(); }}>
                        <div className={styles.infoGrid}>
                            <div>
                                <span className={styles.label}>Email :</span>
                                <input
                                    type="email"
                                    value={editData.email || ''}
                                    onChange={e => handleChange('email', e.target.value)}
                                    disabled
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Taille :</span>
                                <select
                                    value={editData.companySize || ''}
                                    onChange={e => handleChange('companySize', e.target.value)}
                                >
                                    <option value="" disabled>Choisissez la taille</option>
                                    {companySizeOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <span className={styles.label}>Secteur :</span>
                                <select
                                    value={editData.sector || ''}
                                    onChange={e => handleChange('sector', e.target.value)}
                                >
                                    <option value="" disabled>Choisissez le secteur</option>
                                    {sectorOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <span className={styles.label}>Site web :</span>
                                <input
                                    type="text"
                                    value={editData.website || ''}
                                    onChange={e => handleChange('website', e.target.value)}
                                />
                            </div>
                            <div>
                                <span className={styles.label}>LinkedIn :</span>
                                <input
                                    type="text"
                                    value={editData.linkedinUrl || ''}
                                    onChange={e => handleChange('linkedinUrl', e.target.value)}
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Pitch :</span>
                                <textarea
                                    value={editData.pitch || ''}
                                    onChange={e => handleChange('pitch', e.target.value)}
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Valeurs :</span>
                                <div className={styles.listInputGroup}>
                                    <input
                                        type="text"
                                        value={valuesInput}
                                        onChange={e => setValuesInput(e.target.value)}
                                        placeholder="Ajouter une valeur"
                                    />
                                    <button
                                        type="button"
                                        className={styles.addBtn}
                                        onClick={handleAddValue}
                                        aria-label="Ajouter valeur"
                                    >+</button>
                                </div>
                                <div className={styles.tagList}>
                                    {(editData.values || []).map((val: string, idx: number) => (
                                        <span className={styles.tagItem} key={idx}>
                                            {val}
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => handleRemoveValue(idx)}
                                                aria-label="Supprimer valeur"
                                            >×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className={styles.label}>Avantages :</span>
                                <div className={styles.listInputGroup}>
                                    <input
                                        type="text"
                                        value={benefitInput}
                                        onChange={e => setBenefitInput(e.target.value)}
                                        placeholder="Ajouter un avantage"
                                    />
                                    <button
                                        type="button"
                                        className={styles.addBtn}
                                        onClick={handleAddBenefit}
                                        aria-label="Ajouter avantage"
                                    >+</button>
                                </div>
                                <div className={styles.tagList}>
                                    {(editData.benefits || []).map((val: string, idx: number) => (
                                        <span className={styles.tagItem} key={idx}>
                                            {val}
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => handleRemoveBenefit(idx)}
                                                aria-label="Supprimer avantage"
                                            >×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <span className={styles.label}>Localisation :</span>
                        <InteractiveMap
                            initialLatitude={editData.companyLat}
                            initialLongitude={editData.companyLng}
                            onLocationChange={handleMapChange}
                        />
                        <div className={styles.editActions}>
                            <button type="submit" className={styles.saveBtn} disabled={loading}>
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <button type="button" className={styles.cancelBtn} onClick={handleCancel} disabled={loading}>
                                Annuler
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className={styles.infoGrid}>
                            <div>
                                <span className={styles.label}>Email :</span>
                                <span>{profile.email}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Taille :</span>
                                <span>{profile.companySize}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Secteur :</span>
                                <span>{profile.sector}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Site web :</span>
                                <span>{profile.website}</span>
                            </div>
                            <div>
                                <span className={styles.label}>LinkedIn :</span>
                                <span>{profile.linkedinUrl}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Pitch :</span>
                                <span>{profile.pitch}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Valeurs :</span>
                                <span>
                                    {(Array.isArray(profile.values) ? profile.values : [profile.values]).filter(Boolean).join(', ')}
                                </span>
                            </div>
                            <div>
                                <span className={styles.label}>Avantages :</span>
                                <span>
                                    {(Array.isArray(profile.benefits) ? profile.benefits : [profile.benefits]).filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </div>
                        <div className={styles.mapSection}>
                            <h3>Localisation de l'entreprise</h3>
                            <OfferCandidateMap
                                candidates={[]}
                                offer={{
                                    latitude: profile.companyLat,
                                    longitude: profile.companyLng,
                                    title: profile.companyName
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecruiterProfile;
