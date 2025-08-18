import React from 'react';
import styles from './OfferForm.module.scss';
import InteractiveMap from '../../../components/InteractiveMap/InteractiveMap';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import { categories } from '../../../constants/categories';

const contractTypes = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];
const experienceLevels = ['Débutant', 'Junior', 'Intermédiaire', 'Senior', 'Expert'];

interface OfferFormProps {
  form: any;
  errors: { [key: string]: string };
  onChange: (field: string, value: any) => void;
  onMapChange: (loc: { address: string; lat: number; lng: number }) => void;
  onAddSkill: () => void;
  onAddAvantage: () => void;
  onRemoveTag: (type: 'skills' | 'avantages', tag: string) => void;
  onImageChange: (file: File | null, url?: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const OfferForm: React.FC<OfferFormProps> = ({
  form,
  errors,
  onChange,
  onMapChange,
  onAddSkill,
  onAddAvantage,
  onRemoveTag,
  onImageChange,
  onSubmit,
}) => {
  return (
    <form className={styles.formCard} onSubmit={onSubmit}>
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
              onChange={e => onChange('title', e.target.value)}
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
                onChange={e => onChange('teletravail', e.target.checked)}
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
                  onLocationChange={onMapChange}
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
              onChange={e => onChange('salary', e.target.value)}
            />
          </label>
        </div>

        <div className={styles.rowDouble}>
          <label>
            Catégorie <span className={styles.required}>*</span>
            <select
              name="category"
              value={form.category || ''}
              onChange={e => onChange('category', e.target.value)}
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
              onChange={e => onChange('experience', e.target.value)}
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
              onChange={e => onChange('contract', e.target.value)}
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
              onChange={e => onChange('description', e.target.value)}
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
                onChange={e => onChange('skillInput', e.target.value)}
              />
              <button type="button" className={styles.addBtn} onClick={onAddSkill}>+</button>
            </div>
            <div className={styles.tags}>
              {form.skills.map((skill: string) => (
                <span key={skill} className={styles.tag}>
                  {skill}
                  <button type="button" onClick={() => onRemoveTag('skills', skill)}>×</button>
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
                onChange={e => onChange('avantageInput', e.target.value)}
              />
              <button type="button" className={styles.addBtn} onClick={onAddAvantage}>+</button>
            </div>
            <div className={styles.tags}>
              {form.avantages.map((a: string) => (
                <span key={a} className={styles.tag}>
                  {a}
                  <button type="button" onClick={() => onRemoveTag('avantages', a)}>×</button>
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
              onChange={onImageChange}
            />
            {errors.imageUrl && <span className={styles.errorText}>{errors.imageUrl}</span>}
          </label>
        </div>
      </fieldset>

      <div className={styles.actionsRow}>
        <button type="submit" className={styles.submitBtn}>Publier l'annonce</button>
      </div>
    </form>
  );
};

export default OfferForm;
