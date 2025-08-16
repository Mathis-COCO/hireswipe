import React, { useState, useEffect } from 'react';
import styles from './AnnonceForm.module.scss';
import InteractiveMap from '../../components/InteractiveMap/InteractiveMap';

const contractTypes = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];
const experienceLevels = ['Débutant', 'Junior', 'Intermédiaire', 'Senior', 'Expert'];

interface AnnonceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const AnnonceForm: React.FC<AnnonceFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    location: '',
    salary: initialData?.salary || '',
    experience: initialData?.experience || '',
    contract: initialData?.contract || contractTypes[0],
    teletravail: initialData?.teletravail || false,
    description: initialData?.description || '',
    skills: initialData?.skills || [],
    skillInput: '',
    avantages: initialData?.avantages || [],
    avantageInput: '',
    latitude: 48.8566,
    longitude: 2.3522,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...form,
        ...initialData,
        latitude: initialData.latitude || 48.8566,
        longitude: initialData.longitude || 2.3522,
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('location', e.target.value);
  };

  const handleMapLocationChange = (loc: { address: string; lat: number; lng: number }) => {
    setForm(prev => ({
      ...prev,
      location: loc.address,
      latitude: loc.lat,
      longitude: loc.lng,
    }));
  };

  const handleAddSkill = () => {
    const skill = form.skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm(f => ({ ...f, skills: [...f.skills, skill], skillInput: '' }));
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setForm(f => ({ ...f, skills: f.skills.filter((s: string) => s !== skill) }));
  };

  const handleAddAvantage = () => {
    const avantage = form.avantageInput.trim();
    if (avantage && !form.avantages.includes(avantage)) {
      setForm(f => ({ ...f, avantages: [...f.avantages, avantage], avantageInput: '' }));
    }
  };

  const handleRemoveAvantage = (avantage: string) => {
    setForm(f => ({ ...f, avantages: f.avantages.filter((a: string) => a !== avantage) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      skills: form.skills,
      avantages: form.avantages
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <button className={styles.backBtn} type="button" onClick={onCancel}>
          {/* ...existing code... */}
        </button>
        <span className={styles.pageTitle}>Créer une nouvelle annonce</span>
      </div>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <fieldset className={styles.fieldset}>
          <legend>Détails de l'offre</legend>
          <p className={styles.subtitle}>Remplissez les informations de votre offre d'emploi</p>
          <div className={styles.row}>
            <label>
              Titre du poste
              <input
                name="title"
                type="text"
                placeholder="Ex: Développeur Full Stack"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
              />
            </label>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <div className={styles.mapContainer}>
                <InteractiveMap
                  initialLatitude={form.latitude}
                  initialLongitude={form.longitude}
                  onLocationChange={handleMapLocationChange}
                />
              </div>
            </div>
          </div>
          <div className={styles.rowDouble}>
            <label>
              Salaire
              <input
                name="salary"
                type="text"
                placeholder="45-60k€, Selon profil..."
                value={form.salary}
                onChange={e => handleChange('salary', e.target.value)}
              />
            </label>
          </div>
          <div className={styles.rowDouble}>
            <label>
              Expérience requise
              <select name="experience" value={form.experience} onChange={e => handleChange('experience', e.target.value)}>
                <option value="">Niveau d'expérience</option>
                {experienceLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </label>
            <label>
              Type de contrat
              <select name="contract" value={form.contract} onChange={e => handleChange('contract', e.target.value)}>
                {contractTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label style={{ fontWeight: 600 }}>Télétravail possible</label>
              <div className={styles.teletravailBlock}>
                <span className={styles.teletravailSubtitle}>
                  Ce poste peut-il être effectué en télétravail ?
                </span>
                <input
                  type="checkbox"
                  name="teletravail"
                  checked={form.teletravail}
                  onChange={e => handleChange('teletravail', e.target.checked)}
                  className={styles.switch}
                />
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <label>
              Description du poste
              <textarea
                name="description"
                placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </label>
          </div>
          <div className={styles.row}>
            <label>
              Compétences recherchées
              <div className={styles.addRow}>
                <input
                  type="text"
                  placeholder="Ajouter une compétence"
                  value={form.skillInput}
                  onChange={e => setForm(f => ({ ...f, skillInput: e.target.value }))}
                />
                <button type="button" className={styles.addBtn} onClick={handleAddSkill}>+</button>
              </div>
              <div className={styles.tags}>
                {form.skills.map((skill: string) => (
                  <span key={skill} className={styles.tag}>
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            </label>
          </div>
          <div className={styles.row}>
            <label>
              Avantages
              <div className={styles.addRow}>
                <input
                  type="text"
                  placeholder="Ajouter un avantage"
                  value={form.avantageInput}
                  onChange={e => setForm(f => ({ ...f, avantageInput: e.target.value }))}
                />
                <button type="button" className={styles.addBtn} onClick={handleAddAvantage}>+</button>
              </div>
              <div className={styles.tags}>
                {form.avantages.map((a: string) => (
                  <span key={a} className={styles.tag}>
                    {a}
                    <button type="button" onClick={() => handleRemoveAvantage(a)}>×</button>
                  </span>
                ))}
              </div>
            </label>
          </div>
        </fieldset>
        <div className={styles.actionsRow}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>Annuler</button>
          <button type="submit" className={styles.submitBtn}>Publier l'annonce</button>
        </div>
      </form>
    </div>
  );
};

export default AnnonceForm;
