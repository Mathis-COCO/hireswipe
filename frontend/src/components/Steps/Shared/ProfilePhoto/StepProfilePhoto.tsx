import React, { useState } from 'react';
import styles from './StepProfilePhoto.module.scss';
import { Upload, Camera, X, Building2, User } from 'lucide-react';

interface StepProfilePhotoProps {
  icon: React.ComponentType;
  data: any;
  updateData: (data: any) => void;
}

const StepProfilePhoto: React.FC<StepProfilePhotoProps> = ({ icon: Icon, data, updateData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(data.profilePhoto || data.companyLogo || null);

  const isCompany = data.accountType === 'entreprise';
  
  const title = isCompany ? 'Logo de votre entreprise' : 'Votre photo de profil';
  const subtitle = isCompany 
    ? 'Ajoutez le logo de votre entreprise pour vous démarquer auprès des candidats'
    : 'Ajoutez une photo pour personnaliser votre profil et augmenter vos chances de match';
  
  const fieldName = isCompany ? 'companyLogo' : 'profilePhoto';

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPreviewImage(imageUrl);
        updateData({ [fieldName]: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    updateData({ [fieldName]: null });
  };

  const handleSkip = () => {
    updateData({ [fieldName]: null });
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.icon}>
        {isCompany ? <Building2 /> : <User />}
      </div>
      
      <h2>{title}</h2>
      <p>{subtitle}</p>

      <div className={styles.uploadSection}>
        {previewImage ? (
          <div className={styles.previewContainer}>
            <div className={`${styles.imagePreview} ${isCompany ? styles.logoPreview : ''}`}>
              <img src={previewImage} alt={isCompany ? "Logo entreprise" : "Aperçu"} />
              <button 
                type="button" 
                className={styles.removeButton} 
                onClick={removeImage}
              >
                <X size={20} />
              </button>
            </div>
            <p className={styles.previewText}>
              {isCompany ? 'Logo ajouté avec succès' : 'Photo ajoutée avec succès'}
            </p>
          </div>
        ) : (
          <div 
            className={`${styles.uploadZone} ${dragActive ? styles.dragActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileInput"
              className={styles.fileInput}
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <div className={styles.uploadContent}>
              <div className={styles.uploadIcon}>
                {isCompany ? <Building2 size={48} /> : <Camera size={48} />}
              </div>
              
              <h3>
                {isCompany ? 'Ajoutez votre logo' : 'Ajoutez votre photo'}
              </h3>
              
              <p>
                {isCompany 
                  ? 'Glissez-déposez votre logo ici ou cliquez pour parcourir'
                  : 'Glissez-déposez votre photo ici ou cliquez pour parcourir'
                }
              </p>
              
              <label htmlFor="fileInput" className={styles.uploadButton}>
                <Upload size={20} />
                {isCompany ? 'Choisir un logo' : 'Choisir une photo'}
              </label>
            </div>
          </div>
        )}
      </div>

      <div className={styles.formatInfo}>
        <h4>Formats acceptés</h4>
        <p>JPG, PNG, GIF - Maximum 5MB</p>
        {isCompany && (
          <p className={styles.logoTip}>
            💡 Utilisez un logo carré ou rectangulaire pour un meilleur rendu
          </p>
        )}
      </div>

      <button 
        type="button" 
        className={styles.skipButton}
        onClick={handleSkip}
      >
        {isCompany ? 'Ajouter le logo plus tard' : 'Ajouter la photo plus tard'}
      </button>
    </div>
  );
};

export default StepProfilePhoto;