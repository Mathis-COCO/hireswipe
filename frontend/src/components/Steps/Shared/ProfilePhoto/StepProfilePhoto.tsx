import React, { useState, useRef } from 'react';
import styles from './StepProfilePhoto.module.scss';
import { LucideProps } from 'lucide-react';
import { Upload, Camera, Trash2 } from 'lucide-react';

interface StepProps {
    icon: React.ElementType<LucideProps>;
    data: any;
    updateData: (newData: any) => void;
}

const StepProfilePhoto: React.FC<StepProps> = ({ icon: Icon, data, updateData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                updateData({ profilePhotoUrl: imageUrl });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemovePhoto = () => {
        updateData({ profilePhotoUrl: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                updateData({ profilePhotoUrl: imageUrl });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className={styles.stepHeader}>
                <div className={styles.iconContainer}><Icon /></div>
                <h3>Photo de profil</h3>
                <p>Ajoutez votre photo (optionnel)</p>
            </div>

            <div className={styles.uploadSection}>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                {data.profilePhotoUrl ? (
                    <div className={styles.previewBox}>
                        <img src={data.profilePhotoUrl} alt="Profil" />
                        <button type="button" className={styles.removeButton} onClick={handleRemovePhoto}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                ) : (
                    <div
                        className={styles.uploadBox}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className={styles.uploadIcon}><Upload size={48} /></div>
                        <span>Glissez votre photo ici</span>
                        <small>Format recommandé : JPG, PNG (max. 5MB)</small>
                        <button type="button" className={styles.uploadButton}>
                            Choisir une photo
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="bio">Bio (optionnel)</label>
                <textarea
                    id="bio"
                    placeholder="Décrivez-vous en quelques mots..."
                    defaultValue={data.bio || ''}
                    onChange={(e) => updateData({ bio: e.target.value })}
                ></textarea>
            </div>
        </>
    );
};

export default StepProfilePhoto;