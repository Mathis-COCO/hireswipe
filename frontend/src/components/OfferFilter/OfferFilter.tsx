import React from 'react';
import styles from './OfferFilter.module.scss';
import SortButton from '../SortButton/SortButton';

type OfferFilterProps = {
  categories: string[];
  contractTypes: string[];
  experienceLevels: string[];
  cities: string[];
  filters: {
    category: string;
    contract: string;
    city: string;
    experience: string;
    sort: string;
  };
  onChange: (filters: Partial<OfferFilterProps['filters']>) => void;
};

const OfferFilter: React.FC<OfferFilterProps> = ({
  categories,
  contractTypes,
  experienceLevels,
  cities,
  filters,
  onChange,
}) => (
  <div className={styles.filterPanel}>
    <div className={styles.filterRow}>
      <div className={styles.filterField}>
        <label htmlFor="category">Catégorie</label>
        <select
          id="category"
          value={filters.category}
          onChange={e => onChange({ category: e.target.value })}
        >
          <option value="">Toutes</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className={styles.filterField}>
        <label htmlFor="contract">Type d'emploi</label>
        <select
          id="contract"
          value={filters.contract}
          onChange={e => onChange({ contract: e.target.value })}
        >
          <option value="">Tous</option>
          {contractTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <div className={styles.filterField}>
        <label htmlFor="city">Ville</label>
        <select
          id="city"
          value={filters.city}
          onChange={e => onChange({ city: e.target.value })}
        >
          <option value="">Toutes</option>
          {cities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>
      <div className={styles.filterField}>
        <label htmlFor="experience">Expérience</label>
        <select
          id="experience"
          value={filters.experience}
          onChange={e => onChange({ experience: e.target.value })}
        >
          <option value="">Tous</option>
          {experienceLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
        </select>
      </div>
      <div className={styles.filterField}>
        <label>Tri par date</label>
        <SortButton
          sort={filters.sort === 'asc' || filters.sort === 'desc' ? filters.sort : 'desc'}
          onToggle={() => onChange({ sort: filters.sort === 'asc' ? 'desc' : 'asc' })}
        />
      </div>
    </div>
  </div>
);

export default OfferFilter;

