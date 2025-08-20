import React, { useRef } from 'react';
import styles from './ImageUpload.module.scss';
import { Camera } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  imageUrl?: string;
  onChange: (file: File | null, url?: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label = "Ajouter une photo", imageUrl, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange(null, undefined);
    }
  };

  return (
    <div className={styles.uploadWrapper}>
      <label className={styles.uploadLabel} onClick={() => inputRef.current?.click()}>
        {imageUrl ? (
          <img src={imageUrl} alt="Aperçu" className={styles.previewImg} />
        ) : (
          <div className={styles.placeholder}>
            <Camera size={32} style={{ display: 'block', margin: '0 auto 0.5rem auto', color: '#64748b' }} />
            <span>{label}</span>
          </div>
        )}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
