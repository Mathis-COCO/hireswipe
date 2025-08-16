import React, { useState } from 'react';
import styles from './AnnonceForm.module.scss';

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
    location: initialData?.location || '',
    salary: initialData?.salary || '',
    experience: initialData?.experience || '',
    contract: initialData?.contract || contractTypes[0],
    teletravail: initialData?.teletravail || false,
    description: initialData?.description || '',
    skills: initialData?.skills || [],
    skillInput: '',
    avantages: initialData?.avantages || [],
    avantageInput: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onCancel}>← Retour</button>
        <h2>Créer une nouvelle annonce</h2>
      </div>
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
              onChange={handleChange}
            />
          </label>
        </div>
        <div className={styles.rowDouble}>
          <label>
            Localisation
            <input
              name="location"
              type="text"
              placeholder="Paris, Lyon, Remote..."
              value={form.location}
              onChange={handleChange}
            />
          </label>
          <label>
            Salaire
            <input
              name="salary"
              type="text"
              placeholder="45-60k€, Selon profil..."
              value={form.salary}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className={styles.rowDouble}>
          <label>
            Expérience requise
            <select name="experience" value={form.experience} onChange={handleChange}>
              <option value="">Niveau d'expérience</option>
              {experienceLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
          </label>
          <label>
            Type de contrat
            <select name="contract" value={form.contract} onChange={handleChange}>
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
                onChange={handleChange}
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
              onChange={handleChange}
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
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>Annuler</button>
        <button type="submit" className={styles.submitBtn}>Publier l'annonce</button>
      </div>
    </form>
  );
};

export default AnnonceForm;
