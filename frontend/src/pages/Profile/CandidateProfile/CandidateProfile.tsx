import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Profile.module.scss';
import { authService } from '../../../services/authService';
import OfferCandidateMap from '../../../components/Maps/OfferCandidateMap.tsx/OfferCandidateMap';
import InteractiveMap from '../../../components/Maps/InteractiveMap/InteractiveMap';
import { Car, Bike, Truck, Bus, Ship } from 'lucide-react';

const CandidateProfile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [hardSkillInput, setHardSkillInput] = useState('');
    const [softSkillInput, setSoftSkillInput] = useState('');
    const [langInput, setLangInput] = useState({ language: '', level: '' });

    const contractTypeOptions = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'];
    const workModeOptions = ['Présentiel', 'Télétravail', 'Hybride'];

    const licenseTypes = [
        { code: 'Permis A1', description: 'Motocyclettes légères (125 cm³)', color: '#ef4444', icon: Bike },
        { code: 'Permis A2', description: 'Motocs de puissance intermédiaire', color: '#ef4444', icon: Bike },
        { code: 'Permis A', description: 'Toutes les motocyclettes', color: '#ef4444', icon: Bike },
        { code: 'Permis B', description: 'Véhicules légers (voitures)', color: '#3b82f6', icon: Car },
        { code: 'Permis BE', description: 'Voiture avec remorque', color: '#3b82f6', icon: Car },
        { code: 'Permis C1', description: 'Camions jusqu\'à 7,5 tonnes', color: '#f59e0b', icon: Truck },
        { code: 'Permis C', description: 'Poids lourds', color: '#f59e0b', icon: Truck },
        { code: 'Permis D1', description: 'Minibus', color: '#10b981', icon: Bus },
        { code: 'Permis D', description: 'Autobus et autocars', color: '#10b981', icon: Bus },
        { code: 'Permis bateau', description: 'Embarcations de plaisance', color: '#06b6d4', icon: Ship },
    ];

    const experienceOptions = [
        'Débutant',
        'Junior',
        'Intermédiaire',
        'Senior',
        'Expert'
    ];

    useEffect(() => {
        authService.getCurrentUser().then(setProfile);
    }, []);

    useEffect(() => {
        if (isEditing && profile) {
            setEditData({
                ...profile,
                hardSkills: Array.isArray(profile.hardSkills) ? profile.hardSkills : (profile.hardSkills ? [profile.hardSkills] : []),
                softSkills: Array.isArray(profile.softSkills) ? profile.softSkills : (profile.softSkills ? [profile.softSkills] : []),
                languages: Array.isArray(profile.languages) ? profile.languages : (profile.languages ? [profile.languages] : []),
                contractTypes: Array.isArray(profile.contractTypes) ? profile.contractTypes : (profile.contractTypes ? [profile.contractTypes] : []),
                workModes: Array.isArray(profile.workModes) ? profile.workModes : (profile.workModes ? [profile.workModes] : []),
                licenseList: Array.isArray(profile.licenseList) ? profile.licenseList : (profile.licenseList ? [profile.licenseList] : [])
            });
            setHardSkillInput('');
            setSoftSkillInput('');
            setLangInput({ language: '', level: '' });
        }
    }, [isEditing, profile]);

    const handleEditClick = () => setIsEditing(true);
    const handleCancel = () => setIsEditing(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const handleChange = (field: string, value: any) => {
        setEditData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleAddHardSkill = () => {
        if (hardSkillInput.trim()) {
            setEditData((prev: any) => ({
                ...prev,
                hardSkills: [...(prev.hardSkills || []), hardSkillInput.trim()]
            }));
            setHardSkillInput('');
        }
    };
    const handleRemoveHardSkill = (idx: number) => {
        setEditData((prev: any) => ({
            ...prev,
            hardSkills: prev.hardSkills.filter((_: string, i: number) => i !== idx)
        }));
    };
    const handleAddSoftSkill = () => {
        if (softSkillInput.trim()) {
            setEditData((prev: any) => ({
                ...prev,
                softSkills: [...(prev.softSkills || []), softSkillInput.trim()]
            }));
            setSoftSkillInput('');
        }
    };
    const handleRemoveSoftSkill = (idx: number) => {
        setEditData((prev: any) => ({
            ...prev,
            softSkills: prev.softSkills.filter((_: string, i: number) => i !== idx)
        }));
    };
    const handleAddLang = () => {
        if (langInput.language.trim() && langInput.level.trim()) {
            setEditData((prev: any) => ({
                ...prev,
                languages: [...(prev.languages || []), { ...langInput }]
            }));
            setLangInput({ language: '', level: '' });
        }
    };
    const handleRemoveLang = (idx: number) => {
        setEditData((prev: any) => ({
            ...prev,
            languages: prev.languages.filter((_: any, i: number) => i !== idx)
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await authService.updateProfile(editData);
            setProfile(editData);
            setIsEditing(false);
        } catch (err) { }
        setLoading(false);
    };

    const handleMapChange = (loc: { address: string; lat: number; lng: number }) => {
        setEditData((prev: any) => ({
            ...prev,
            candidateLocationAddress: loc.address,
            latitude: loc.lat,
            longitude: loc.lng
        }));
    };

    const handlePhotoFile = (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            setEditData((prev: any) => ({ ...prev, profilePhoto: url }));
        };
        reader.readAsDataURL(file);
    };

    const triggerPhotoInput = () => {
        const el = document.getElementById('candidatePhotoInput') as HTMLInputElement | null;
        el?.click();
    };

    const handleToggleContractType = (type: string) => {
        setEditData((prev: any) => {
            const currentTypes = prev.contractTypes || [];
            const newTypes = currentTypes.includes(type)
                ? currentTypes.filter((t: string) => t !== type)
                : [...currentTypes, type];
            return { ...prev, contractTypes: newTypes };
        });
    };

    const handleToggleWorkMode = (mode: string) => {
        setEditData((prev: any) => {
            const currentModes = prev.workModes || [];
            const newModes = currentModes.includes(mode)
                ? currentModes.filter((m: string) => m !== mode)
                : [...currentModes, mode];
            return { ...prev, workModes: newModes };
        });
    };

    const handleToggleLicense = (code: string) => {
        setEditData((prev: any) => {
            const arr = prev.licenseList || [];
            return {
                ...prev,
                licenseList: arr.includes(code)
                    ? arr.filter((c: string) => c !== code)
                    : [...arr, code]
            };
        });
    };

    const handleExperienceChange = (exp: string) => {
        setEditData((prev: any) => ({
            ...prev,
            experience: exp
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
                        src={profile.profilePhotoUrl || profile.profilePhoto || ''}
                        alt="Profil"
                        className={styles.logo}
                    />
                    <div>
                        <h2 className={styles.companyName}>{profile.firstName} {profile.lastName}</h2>
                        <p className={styles.sector}>{profile.jobTitle}</p>
                    </div>
                </div>
                {isEditing && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', alignItems: 'center' }}>
                        <input id="candidatePhotoInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files && e.target.files[0]) handlePhotoFile(e.target.files[0]); }} />
                        <button type="button" className={styles.editBtn} onClick={triggerPhotoInput}>Changer la photo</button>
                    </div>
                )}
                <div style={{ textAlign: 'right', marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    {!isEditing && (
                        <>
                            <button className={styles.editBtn} onClick={handleEditClick}>
                                Modifier le profil
                            </button>
                            <button className={styles.logoutBtn} onClick={handleLogout}>
                                Se déconnecter
                            </button>
                        </>
                    )}
                    {isEditing && (
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            Se déconnecter
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
                                <span className={styles.label}>Téléphone :</span>
                                <input
                                    type="text"
                                    value={editData.phone || ''}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    placeholder="Numéro de téléphone"
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Prénom :</span>
                                <input
                                    type="text"
                                    value={editData.firstName || ''}
                                    onChange={e => handleChange('firstName', e.target.value)}
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Nom :</span>
                                <input
                                    type="text"
                                    value={editData.lastName || ''}
                                    onChange={e => handleChange('lastName', e.target.value)}
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Poste :</span>
                                <input
                                    type="text"
                                    value={editData.jobTitle || ''}
                                    onChange={e => handleChange('jobTitle', e.target.value)}
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Bio :</span>
                                <textarea
                                    value={editData.bio || ''}
                                    onChange={e => handleChange('bio', e.target.value)}
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Expériences professionnelles :</span>
                                <textarea
                                    value={editData.workExperiences || ''}
                                    onChange={e => handleChange('workExperiences', e.target.value)}
                                    placeholder="Décrivez vos expériences"
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Formation :</span>
                                <input
                                    type="text"
                                    value={editData.education || ''}
                                    onChange={e => handleChange('education', e.target.value)}
                                    placeholder="Votre formation"
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Salaire souhaité :</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={editData.desiredSalary || ''}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        handleChange('desiredSalary', val);
                                    }}
                                    placeholder="Salaire souhaité"
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Mobilité :</span>
                                <input
                                    type="text"
                                    value={editData.mobility || ''}
                                    onChange={e => handleChange('mobility', e.target.value)}
                                    placeholder="Mobilité géographique"
                                />
                            </div>
                            <div>
                                <span className={styles.label}>Compétences techniques :</span>
                                <div className={styles.listInputGroup}>
                                    <input
                                        type="text"
                                        value={hardSkillInput}
                                        onChange={e => setHardSkillInput(e.target.value)}
                                        placeholder="Ajouter une compétence"
                                    />
                                    <button
                                        type="button"
                                        className={styles.addBtn}
                                        onClick={handleAddHardSkill}
                                        aria-label="Ajouter compétence"
                                    >+</button>
                                </div>
                                <div className={styles.tagList}>
                                    {(editData.hardSkills || []).map((val: string, idx: number) => (
                                        <span className={styles.tagItem} key={idx}>
                                            {val}
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => handleRemoveHardSkill(idx)}
                                                aria-label="Supprimer compétence"
                                            >×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className={styles.label}>Compétences humaines :</span>
                                <div className={styles.listInputGroup}>
                                    <input
                                        type="text"
                                        value={softSkillInput}
                                        onChange={e => setSoftSkillInput(e.target.value)}
                                        placeholder="Ajouter une compétence"
                                    />
                                    <button
                                        type="button"
                                        className={styles.addBtn}
                                        onClick={handleAddSoftSkill}
                                        aria-label="Ajouter compétence"
                                    >+</button>
                                </div>
                                <div className={styles.tagList}>
                                    {(editData.softSkills || []).map((val: string, idx: number) => (
                                        <span className={styles.tagItem} key={idx}>
                                            {val}
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => handleRemoveSoftSkill(idx)}
                                                aria-label="Supprimer compétence"
                                            >×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className={styles.label}>Langues :</span>
                                <div className={styles.listInputGroup}>
                                    <input
                                        type="text"
                                        value={langInput.language}
                                        onChange={e => setLangInput(l => ({ ...l, language: e.target.value }))}
                                        placeholder="Langue"
                                    />
                                    <input
                                        type="text"
                                        value={langInput.level}
                                        onChange={e => setLangInput(l => ({ ...l, level: e.target.value }))}
                                        placeholder="Niveau"
                                    />
                                    <button
                                        type="button"
                                        className={styles.addBtn}
                                        onClick={handleAddLang}
                                        aria-label="Ajouter langue"
                                    >+</button>
                                </div>
                                <div className={styles.tagList}>
                                    {(editData.languages || []).map((lang: any, idx: number) => (
                                        <span className={styles.tagItem} key={idx}>
                                            {lang.language} ({lang.level})
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => handleRemoveLang(idx)}
                                                aria-label="Supprimer langue"
                                            >×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className={styles.label}>Types de contrat :</span>
                                <div className={styles.toggleOptions}>
                                    {contractTypeOptions.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            className={`${styles.toggleOption} ${editData.contractTypes?.includes(type) ? styles.active : ''}`}
                                            onClick={() => handleToggleContractType(type)}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className={styles.label}>Modes de travail :</span>
                                <div className={styles.toggleOptions}>
                                    {workModeOptions.map(mode => (
                                        <button
                                            key={mode}
                                            type="button"
                                            className={`${styles.toggleOption} ${editData.workModes?.includes(mode) ? styles.active : ''}`}
                                            onClick={() => handleToggleWorkMode(mode)}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className={styles.label}>Niveau d'expérience :</span>
                                <div className={styles.toggleOptions}>
                                    {experienceOptions.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            className={`${styles.toggleOption} ${editData.experience === opt ? styles.active : ''}`}
                                            onClick={() => handleExperienceChange(opt)}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className={styles.label}>Permis :</span>
                            <div className={styles.licenseGrid}>
                                {licenseTypes.map(lic => {
                                    const selected = editData.licenseList?.includes(lic.code);
                                    return (
                                        <div
                                            key={lic.code}
                                            className={`${styles.licenseItem} ${selected ? 'selected' : ''} ${styles[lic.icon.displayName?.toLowerCase() || 'car']}`}
                                            style={selected ? { borderColor: lic.color } : {}}
                                            onClick={() => handleToggleLicense(lic.code)}
                                        >
                                            <div
                                                className={styles.licenseIcon}
                                                style={{ color: lic.color }}
                                            >
                                                <lic.icon color={lic.color} size={32} />
                                            </div>
                                            <div className={styles.licenseInfo}>
                                                <span className={styles.licenseCode}>{lic.code}</span>
                                                <span className={styles.licenseDescription}>{lic.description}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <span className={styles.label}>Localisation :</span>
                        <InteractiveMap
                            initialLatitude={editData.latitude}
                            initialLongitude={editData.longitude}
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
                            {profile.email && (
                                <div>
                                    <span className={styles.label}>Email :</span>
                                    <span>{profile.email}</span>
                                </div>
                            )}
                            {profile.phone && (
                                <div>
                                    <span className={styles.label}>Téléphone :</span>
                                    <span>{profile.phone}</span>
                                </div>
                            )}
                            {profile.firstName && (
                                <div>
                                    <span className={styles.label}>Prénom :</span>
                                    <span>{profile.firstName}</span>
                                </div>
                            )}
                            {profile.lastName && (
                                <div>
                                    <span className={styles.label}>Nom :</span>
                                    <span>{profile.lastName}</span>
                                </div>
                            )}
                            {profile.jobTitle && (
                                <div>
                                    <span className={styles.label}>Poste :</span>
                                    <span>{profile.jobTitle}</span>
                                </div>
                            )}
                            {profile.bio && (
                                <div>
                                    <span className={styles.label}>Bio :</span>
                                    <span>{profile.bio}</span>
                                </div>
                            )}
                            {profile.workExperiences && (
                                <div>
                                    <span className={styles.label}>Expériences professionnelles :</span>
                                    <span>{profile.workExperiences}</span>
                                </div>
                            )}
                            {profile.education && (
                                <div>
                                    <span className={styles.label}>Formation :</span>
                                    <span>{profile.education}</span>
                                </div>
                            )}
                            {profile.desiredSalary && (
                                <div>
                                    <span className={styles.label}>Salaire souhaité :</span>
                                    <span>{profile.desiredSalary}</span>
                                </div>
                            )}
                            {profile.mobility && (
                                <div>
                                    <span className={styles.label}>Mobilité :</span>
                                    <span>{profile.mobility}</span>
                                </div>
                            )}
                            {(profile.hardSkills && profile.hardSkills.length > 0) && (
                                <div>
                                    <span className={styles.label}>Compétences techniques :</span>
                                    <div className={styles.tagList}>
                                        {profile.hardSkills.map((val: string, idx: number) => (
                                            <span className={styles.tagItem} key={idx}>{val}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {(profile.softSkills && profile.softSkills.length > 0) && (
                                <div>
                                    <span className={styles.label}>Compétences humaines :</span>
                                    <div className={styles.tagList}>
                                        {profile.softSkills.map((val: string, idx: number) => (
                                            <span className={styles.tagItem} key={idx}>{val}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {(profile.languages && profile.languages.length > 0) && (
                                <div>
                                    <span className={styles.label}>Langues :</span>
                                    <div className={styles.tagList}>
                                        {profile.languages.map((lang: any, idx: number) => (
                                            <span className={styles.tagItem} key={idx}>
                                                {lang.language} ({lang.level})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {(profile.contractTypes && profile.contractTypes.length > 0) && (
                                <div>
                                    <span className={styles.label}>Types de contrat :</span>
                                    <div className={styles.toggleOptions}>
                                        {contractTypeOptions
                                            .filter(type => profile.contractTypes?.includes(type))
                                            .map(type => (
                                                <span
                                                    key={type}
                                                    className={`${styles.toggleOption} ${styles.active}`}
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}
                            {(profile.workModes && profile.workModes.length > 0) && (
                                <div>
                                    <span className={styles.label}>Modes de travail :</span>
                                    <div className={styles.toggleOptions}>
                                        {workModeOptions
                                            .filter(mode => profile.workModes?.includes(mode))
                                            .map(mode => (
                                                <span
                                                    key={mode}
                                                    className={`${styles.toggleOption} ${styles.active}`}
                                                >
                                                    {mode}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}
                            {profile.experience && (
                                <div>
                                    <span className={styles.label}>Niveau d'expérience :</span>
                                    <div className={styles.toggleOptions}>
                                        <span className={`${styles.toggleOption} ${styles.active}`}>{profile.experience}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {(profile.licenseList && profile.licenseList.length > 0) && (
                            <div>
                                <span className={styles.label}>Permis :</span>
                                <div className={styles.licenseGrid}>
                                    {licenseTypes.filter(lic => profile.licenseList?.includes(lic.code)).map(lic => (
                                        <div
                                            key={lic.code}
                                            className={`${styles.licenseItem} ${styles.selected}`}
                                            style={{ borderColor: lic.color }}
                                        >
                                            <div
                                                className={`${styles.licenseIcon} ${styles[lic.icon.displayName?.toLowerCase() || 'car']}`}
                                                style={{ color: lic.color }}
                                            >
                                                <lic.icon color={lic.color} size={32} />
                                            </div>
                                            <div className={styles.licenseInfo}>
                                                <span className={styles.licenseCode}>{lic.code}</span>
                                                <span className={styles.licenseDescription}>{lic.description}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className={styles.mapSection}>
                            <h3>Localisation</h3>
                            <OfferCandidateMap
                                candidates={[profile]}
                                offer={{
                                    latitude: profile.latitude,
                                    longitude: profile.longitude,
                                    title: profile.jobTitle
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CandidateProfile;
