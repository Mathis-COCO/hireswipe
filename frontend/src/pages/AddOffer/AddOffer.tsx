import React, { useState } from 'react';
import styles from './AddOffer.module.scss';
import InteractiveMap from '../../components/InteractiveMap/InteractiveMap';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { categories } from '../../constants/categories';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { offerService } from '../../services/offerService';

const contractTypes = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];
const experienceLevels = ['Débutant', 'Junior', 'Intermédiaire', 'Senior', 'Expert'];

const AddOffer: React.FC = () => {
  const [form, setForm] = useState<{
    title: string | null;
    location: string | null;
    salary: string | null;
    experience: string | null;
    contract: string | null;
    teletravail: boolean;
    description: string | null;
    skills: string[];
    skillInput: string | null;
    avantages: string[];
    avantageInput: string | null;
    latitude: number | null;
    longitude: number | null;
    category: string | null;
    imageUrl: string | null;
    recruiterId: string | null;
    candidates: string[];
    isActive: boolean;
    offerDate: Date;
  }>({
    title: null,
    location: null,
    salary: null,
    experience: null,
    contract: null,
    teletravail: false,
    description: null,
    skills: [],
    skillInput: null,
    avantages: [],
    avantageInput: null,
    latitude: null,
    longitude: null,
    category: null,
    imageUrl: null,
    recruiterId: null,
    candidates: [],
    isActive: true,
    offerDate: new Date(),
  });

  React.useEffect(() => {
    (async () => {
      const user = await authService.getCurrentUser();
      setForm(prev => ({
        ...prev,
        recruiterId: user?.id ?? null,
      }));
    })();
  }, []);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
    const skill = form?.skillInput?.trim?.();
    if (skill && Array.isArray(form.skills) && !form.skills.includes(skill)) {
      setForm(f => ({ ...f, skills: [...f.skills, skill], skillInput: '' }));
    }
  };

  const handleAddAvantage = () => {
    const avantage = form?.avantageInput?.trim?.();
    if (avantage && Array.isArray(form.avantages) && !form.avantages.includes(avantage)) {
      setForm(f => ({ ...f, avantages: [...f.avantages, avantage], avantageInput: '' }));
    }
  };

  const handleRemoveTag = (type: 'skills' | 'avantages', tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      [type]: (prev[type] as string[]).filter(tag => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (file: File | null, url?: string) => {
    setForm(f => ({
      ...f,
      imageUrl: url ?? null,
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title || !form.title.trim()) {
      newErrors.title = 'Le titre est obligatoire.';
    }
    if (!form.category) {
      newErrors.category = 'La catégorie est obligatoire.';
    }
    if (!form.experience) {
      newErrors.experience = 'Le niveau d\'expérience est obligatoire.';
    }
    if (!form.contract) {
      newErrors.contract = 'Le type de contrat est obligatoire.';
    }
    if (!form.imageUrl) {
      newErrors.imageUrl = 'Une image est obligatoire.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      offerService.createOffer({
        ...form,
      });
      navigate('/mes-offres');
      console.log('Offre publiée :', form);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
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
                value={form.title || ''}
                onChange={e => handleChange('title', e.target.value)}
                className={errors.title ? styles.errorInput : ''}
              />
              {errors.title && <span className={styles.errorText}>{errors.title}</span>}
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
                  className={styles.switch}
                />
              </div>
            </div>
          </div>
          {!form.teletravail && (
            <div className={styles.row}>
              <div className={styles.field}>
                <div className={styles.mapContainer}>
                  <InteractiveMap
                    initialLatitude={form.latitude ?? undefined}
                    initialLongitude={form.longitude ?? undefined}
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
                value={form.salary || ''}
                onChange={e => handleChange('salary', e.target.value)}
              />
            </label>
          </div>
          <div className={styles.rowDouble}>
            <label>
              Catégorie <span className={styles.required}>*</span>
              <select
                name="category"
                value={form.category || ''}
                onChange={e => handleChange('category', e.target.value)}
                className={errors.category ? styles.errorInput : ''}
              >
                <option value="">Choisissez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className={styles.errorText}>{errors.category}</span>}
            </label>
            <label>
              Expérience requise <span className={styles.required}>*</span>
              <select
                name="experience"
                value={form.experience || ''}
                onChange={e => handleChange('experience', e.target.value)}
                className={errors.experience ? styles.errorInput : ''}
              >
                <option value="">Niveau d'expérience</option>
                {experienceLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
              {errors.experience && <span className={styles.errorText}>{errors.experience}</span>}
            </label>
            <label>
              Type de contrat <span className={styles.required}>*</span>
              <select
                name="contract"
                value={form.contract || ''}
                onChange={e => handleChange('contract', e.target.value)}
                className={errors.contract ? styles.errorInput : ''}
              >
                <option value="">Choisissez un contrat</option>
                {contractTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              {errors.contract && <span className={styles.errorText}>{errors.contract}</span>}
            </label>
          </div>
          <div className={styles.row}>
            <label>
              Description du poste
              <textarea
                name="description"
                placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                value={form.description || ''}
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
                  value={form.skillInput || ''}
                  onChange={e => handleChange('skillInput', e.target.value)}
                />
                <button type="button" className={styles.addBtn} onClick={handleAddSkill}>+</button>
              </div>
              <div className={styles.tags}>
                {form.skills.map((skill: string) => (
                  <span key={skill} className={styles.tag}>
                    {skill}
                    <button type="button" onClick={() => handleRemoveTag('skills', skill)}>×</button>
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
                  value={form.avantageInput || ''}
                  onChange={e => handleChange('avantageInput', e.target.value)}
                />
                <button type="button" className={styles.addBtn} onClick={handleAddAvantage}>+</button>
              </div>
              <div className={styles.tags}>
                {form.avantages.map((a: string) => (
                  <span key={a} className={styles.tag}>
                    {a}
                    <button type="button" onClick={() => handleRemoveTag('avantages', a)}>×</button>
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
                imageUrl={form.imageUrl || undefined}
                onChange={handleImageChange}
              />
              {errors.imageUrl && <span className={styles.errorText}>{errors.imageUrl}</span>}
            </label>
          </div>
        </fieldset>
        <div className={styles.actionsRow}>
          <button type="submit" className={styles.submitBtn}>Publier l'annonce</button>
        </div>
      </form>
    </div>
  );
};

export default AddOffer;