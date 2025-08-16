import React, { useState, useEffect } from 'react';
import styles from './AnnonceForm.module.scss';
import InteractiveMap from '../../components/InteractiveMap/InteractiveMap';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { categories } from '../../constants/categories';

const contractTypes = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];
const experienceLevels = ['Débutant', 'Junior', 'Intermédiaire', 'Senior', 'Expert'];

interface AnnonceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const requiredFields = [
  'title', 'teletravail', 'category', 'experience', 'contract', 'imageUrl'
];

const AnnonceForm: React.FC<AnnonceFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [form, setForm] = useState<{
    title: any;
    location: string;
    salary: any;
    experience: any;
    contract: any;
    teletravail: any;
    description: any;
    skills: any;
    skillInput: string;
    avantages: any;
    avantageInput: string;
    latitude: number;
    longitude: number;
    category: any;
    imageUrl: any;
    imageFile: File | null;
  }>({
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
    category: initialData?.category || '',
    imageUrl: initialData?.imageUrl || '',
    imageFile: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...form,
        ...initialData,
        latitude: initialData.latitude || 48.8566,
        longitude: initialData.longitude || 2.3522,
        category: initialData.category || '',
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

  const handleImageChange = (file: File | null, url?: string) => {
    setForm(f => ({
      ...f,
      imageFile: file,
      imageUrl: url || ''
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};
    newErrors.title = !form.title.trim();
    newErrors.teletravail = typeof form.teletravail !== 'boolean';
    newErrors.category = !form.category;
    newErrors.experience = !form.experience;
    newErrors.contract = !form.contract;
    newErrors.imageUrl = !form.imageUrl;
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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
              Titre du poste <span className={styles.required}>*</span>
              <input
                name="title"
                type="text"
                placeholder="Ex: Développeur Full Stack"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                className={errors.title ? styles.errorInput : ''}
              />
              {errors.title && <span className={styles.errorText}>Ce champ est obligatoire</span>}
            </label>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <div className={styles.teletravailBlock}>
                <span className={styles.teletravailSubtitle}>
                  Ce poste est-il en télétravail ?
                </span>
                <input
                  type="checkbox"
                  name="teletravail"
                  checked={form.teletravail}
                  onChange={e => handleChange('teletravail', e.target.checked)}
                  className={errors.teletravail ? styles.errorInput : styles.switch}
                />
              </div>
              {errors.teletravail && <span className={styles.errorText}>Ce champ est obligatoire</span>}
            </div>
          </div>
          {!form.teletravail && (
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
          )}
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
              Catégorie <span className={styles.required}>*</span>
              <select
                name="category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className={errors.category ? styles.errorInput : ''}
              >
                <option value="">Choisissez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className={styles.errorText}>Ce champ est obligatoire</span>}
            </label>
            <label>
              Expérience requise <span className={styles.required}>*</span>
              <select name="experience" value={form.experience} onChange={e => handleChange('experience', e.target.value)}
                className={errors.experience ? styles.errorInput : ''}
              >
                <option value="">Niveau d'expérience</option>
                {experienceLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
              {errors.experience && <span className={styles.errorText}>Ce champ est obligatoire</span>}
            </label>
            <label>
              Type de contrat <span className={styles.required}>*</span>
              <select name="contract" value={form.contract} onChange={e => handleChange('contract', e.target.value)}
                className={errors.contract ? styles.errorInput : ''}
              >
                {contractTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              {errors.contract && <span className={styles.errorText}>Ce champ est obligatoire</span>}
            </label>
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
          <div className={styles.row}>
            <label>
              Photo de l'annonce <span className={styles.required}>*</span>
              <ImageUpload
                label="Ajouter une photo"
                imageUrl={form.imageUrl}
                onChange={handleImageChange}
              />
              {errors.imageUrl && <span className={styles.errorText}>Ce champ est obligatoire</span>}
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
