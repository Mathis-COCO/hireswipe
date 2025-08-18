import React, { useEffect, useState } from 'react';
import OfferList from '../../components/OfferList/OfferList';
import styles from './MyOffers.module.scss';
import { offerService } from '../../services/offerService';

type Offer = {
  id: string;
  title: string;
  location: string;
  salary: string;
  experience: string;
  contract: string;
  teletravail: boolean;
  description: string;
  skills: string[];
  avantages: any[];
  publishedAt: string;
  candidates: number;
};

const MyOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      const myOffers = await offerService.getMyOffers();
      setOffers(myOffers);
    };
    fetchOffers();
  }, []);

  const handleEdit = (id: string) => {
    setEditId(id);
  };

  const handleDelete = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  const handleSubmit = (data: any) => {
    if (editId) {
      setOffers(offers.map(o => o.id === editId ? { ...o, ...data } : o));
    } else {
      setOffers([
        ...offers,
        {
          ...data,
          id: Math.random().toString(36).slice(2),
          publishedAt: new Date().toLocaleDateString('fr-FR'),
          candidates: 0
        }
      ]);
    }
    setEditId(null);
  };

  const handleView = (id: string) => {
    alert('Voir les détails/candidatures de l\'offre');
  };

  return (
    <OfferList
      offers={offers}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
    />
  );
};

export default MyOffers;
