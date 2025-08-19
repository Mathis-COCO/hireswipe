import React, { useState, useEffect } from 'react';
import styles from '../AddOffer/AddOffer.module.scss';
import styles2 from '../App.module.scss'
import OfferForm from '../../components/Forms/OfferForm/OfferForm';
import { authService } from '../../services/authService';
import { offerService } from '../../services/offerService';
import { useNavigate, useParams } from 'react-router-dom';

const EditOffer: React.FC = () => {
    const { offerId: offerId } = useParams<{ offerId: string }>();
    const [form, setForm] = useState<any>({
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

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const user = await authService.getCurrentUser();
            setForm((prev: typeof form) => ({ ...prev, recruiterId: user?.id ?? null }));

            if (offerId) {
                const offer = await offerService.getOfferById(Number(offerId));
                setForm({ ...offer });
            }
        })();
    }, [offerId]);

    const handleChange = (field: string, value: any) => {
        setForm((prev: typeof form) => ({ ...prev, [field]: value }));
    };

    const handleAddSkill = () => {
        const skill = form?.skillInput?.trim?.();
        if (skill && Array.isArray(form.skills) && !form.skills.includes(skill)) {
            setForm((f: typeof form) => ({ ...f, skills: [...f.skills, skill], skillInput: '' }));
        }
    };

    const handleAddAvantage = () => {
        const avantage = form?.avantageInput?.trim?.();
        if (avantage && Array.isArray(form.avantages) && !form.avantages.includes(avantage)) {
            setForm((f: typeof form) => ({ ...f, avantages: [...f.avantages, avantage], avantageInput: '' }));
        }
    };

    const handleRemoveTag = (type: 'skills' | 'avantages', tagToRemove: string) => {
        setForm((prev: typeof form) => ({
            ...prev,
            [type]: (prev[type] as string[]).filter(tag => tag !== tagToRemove),
        }));
    };

    const handleImageChange = (file: File | null, url?: string) => {
        setForm((f: typeof form) => ({ ...f, imageUrl: url ?? null }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.title || !form.title.trim()) newErrors.title = 'Le titre est obligatoire.';
        if (!form.category) newErrors.category = 'La catégorie est obligatoire.';
        if (!form.experience) newErrors.experience = 'Le niveau d\'expérience est obligatoire.';
        if (!form.contract) newErrors.contract = 'Le type de contrat est obligatoire.';
        if (!form.description) newErrors.description = 'La description est obligatoire.';
        if (!form.imageUrl) newErrors.imageUrl = 'Une image est obligatoire.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate() && offerId) {
            offerService.updateOffer(Number(offerId), form);
            navigate('/mes-offres');
        }
    };

    return (
        <div className={styles2.appRoot}>
            <div className={styles.wrapper}>
                <div className={styles.headerRow}>
                    <span className={styles.pageTitle}>Modifier votre annonce</span>
                </div>
                <OfferForm
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onMapChange={loc => setForm((prev: typeof form) => ({ ...prev, location: loc.address, latitude: loc.lat, longitude: loc.lng }))}
                    onAddSkill={handleAddSkill}
                    onAddAvantage={handleAddAvantage}
                    onRemoveTag={handleRemoveTag}
                    onImageChange={handleImageChange}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default EditOffer;
