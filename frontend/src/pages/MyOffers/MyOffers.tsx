import React, { useEffect, useState } from 'react';
import OfferList from '../../components/OfferList/OfferList';
import OfferFilter from '../../components/OfferFilter/OfferFilter';
import styles from './MyOffers.module.scss';
import { offerService } from '../../services/offerService';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../constants/categories';

type Offer = {
  id: string;
  title: string;
  location: string;
  salary: string;
  experience: string;
  contract: string;
  category: string;
  teletravail: boolean;
  description: string;
  skills: string[];
  avantages: any[];
  publishedAt: string;
  candidates: number;
};

const contractTypes = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];
const experienceLevels = ['Débutant', 'Junior', 'Intermédiaire', 'Senior', 'Expert'];

const MyOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    contract: '',
    city: '',
    experience: '',
    sort: 'desc',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      const myOffers = await offerService.getMyOffers();
      setOffers(myOffers);
    };
    fetchOffers();
  }, []);

  const cities = Array.from(
    new Set(
      offers
        .map(o => o.location ? o.location.split(',')[0].trim() : '')
        .filter(city => !!city)
    )
  );

  const handleEdit = (id: string) => {
    setEditId(id);
  };

  const handleDelete = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  const handleView = (id: string) => {
    alert('Voir les détails/candidatures de l\'offre');
  };

  const filteredOffers = offers
    .filter(o =>
      (!filters.category || o.category === filters.category) &&
      (!filters.contract || o.contract === filters.contract) &&
      (!filters.city || (o.location && o.location.split(',')[0]?.trim() === filters.city)) &&
      (!filters.experience || o.experience === filters.experience)
    )
    .sort((a, b) => {
      const getDate = (offer: Offer) => {
        if (!offer.publishedAt) return 0;
        const parts = offer.publishedAt.split('/');
        if (parts.length === 3) {
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
        }
        return new Date(offer.publishedAt).getTime();
      };
      const dateA = getDate(a);
      const dateB = getDate(b);
      return filters.sort === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    });

  const handleFilterChange = (changed: Partial<typeof filters>) => {
    setFilters(f => ({ ...f, ...changed }));
  };

  return (
    <div>
      <div className={styles.header}>
        <h2>Mes offres</h2>
        <p>Gérez vos offres d'emploi et suivez les candidatures</p>
        <button className={styles.newBtn} onClick={() => setEditId(null)}>+ Nouvelle offre</button>
      </div>
      <OfferFilter
        categories={categories}
        contractTypes={contractTypes}
        experienceLevels={experienceLevels}
        cities={cities}
        filters={filters}
        onChange={handleFilterChange}
      />
      <OfferList
        offers={filteredOffers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
};

export default MyOffers;
