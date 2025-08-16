import React, { useState } from 'react';
import AnnonceList from '../../components/AnnonceList/AnnonceList';
import AnnonceForm from '../../components/Forms/AnnonceForm/AnnonceForm';
import styles from './AddAnnonce.module.scss';

const initialAnnonces = [
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

const AddAnnonce: React.FC = () => {
  const [annonces, setAnnonces] = useState(initialAnnonces);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleNew = () => {
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAnnonces(annonces.filter(a => a.id !== id));
  };

  const handleSubmit = (data: any) => {
    if (editId) {
      setAnnonces(annonces.map(a => a.id === editId ? { ...a, ...data } : a));
    } else {
      setAnnonces([
        ...annonces,
        {
          ...data,
          id: Math.random().toString(36).slice(2),
          publishedAt: new Date().toLocaleDateString('fr-FR'),
          candidates: 0
        }
      ]);
    }
    setShowForm(false);
    setEditId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
  };

  const handleView = (id: string) => {
    alert('Voir les détails/candidatures de l\'annonce');
  };

  return (
    <>
      {showForm ? (
        <AnnonceForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editId ? annonces.find(a => a.id === editId) : undefined}
        />
      ) : (
        <AnnonceList
          annonces={annonces}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onNew={handleNew}
        />
      )}
    </>
  );
};

export default AddAnnonce;
