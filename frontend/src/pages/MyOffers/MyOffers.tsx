import React, { useState } from 'react';
import OfferList from '../../components/OfferList/OfferList';
import styles from './MyOffers.module.scss';

const initialOffers = [
  {
    id: '1',
    title: 'Développeur Full Stack Senior',
    location: 'Paris',
    salary: '55-70k€',
    experience: '5+ ans',
    contract: 'CDI',
    teletravail: true,
    description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe technique et participer au développement de nos applications web innovantes.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    avantages: [],
    publishedAt: '20/01/2024',
    candidates: 12
  },
  {
    id: '2',
    title: 'Product Manager',
    location: 'Paris',
    salary: '60-75k€',
    experience: '3-5 ans',
    contract: 'CDI',
    teletravail: false,
    description: 'Rejoignez notre équipe produit pour définir la vision et la stratégie de nos produits.',
    skills: ['Product Management', 'Agile', 'Data Analysis'],
    avantages: [],
    publishedAt: '18/01/2024',
    candidates: 12
  }
];

const MyOffers: React.FC = () => {
  const [offers, setOffers] = useState(initialOffers);
  const [editId, setEditId] = useState<string | null>(null);

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
