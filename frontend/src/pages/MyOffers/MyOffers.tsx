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
  createdAt: string;
  updatedAt: string;
  candidates: any[];
  isAvailable: boolean;
};

const contractTypes = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];
const experienceLevels = ['Débutant', 'Junior', 'Intermédiaire', 'Senior', 'Expert'];

const MyOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
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

  const handleDelete = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
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
        if (!offer.createdAt) return 0;
        const parts = offer.createdAt.split('/');
        if (parts.length === 3) {
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
        }
        return new Date(offer.createdAt).getTime();
      };
      const dateA = getDate(a);
      const dateB = getDate(b);
      return filters.sort === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    });

  const availableOffers = filteredOffers.filter(o => o.isAvailable !== false);
  const unavailableOffers = filteredOffers.filter(o => o.isAvailable === false);

  const handleFilterChange = (changed: Partial<typeof filters>) => {
    setFilters(f => ({ ...f, ...changed }));
  };

  const redirect = (route: string) => {
    navigate(route);
  };

  return (
    <div>
      <div className={styles.header}>
        <h2>Mes offres</h2>
        <p>Gérez vos offres d'emploi et suivez les candidatures</p>
        <button className={styles.newBtn} onClick={() => redirect('/ajouter-offre')}>+ Nouvelle offre</button>
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
        offers={availableOffers}
        onDelete={handleDelete}
      />
      {unavailableOffers.length > 0 && (
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '2px dashed #d7263d' }}>
          <h3 style={{ color: '#d7263d', fontWeight: 600, marginBottom: 18 }}>Offres indisponibles</h3>
          <OfferList
            offers={unavailableOffers}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default MyOffers;
