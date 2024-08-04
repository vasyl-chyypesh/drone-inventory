import { CollectionConfig } from 'payload/types';
import { adminOnly } from '../access/adminOnly';

const MarketPlaces: CollectionConfig = {
  slug: 'market_places',
  labels: {
    singular: 'Market place',
    plural: 'Market places',
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'name',
    description: 'Market places',
    defaultColumns: ['name', 'link'],
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'link',
      type: 'text',
      required: false,
    },
  ],
};

export default MarketPlaces;
