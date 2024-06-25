import { CollectionConfig } from 'payload/types';
import { adminOnly } from '../access/adminOnly';

const Customers: CollectionConfig = {
  slug: 'customers',
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'name',
    description: 'Customer of drones',
    disableDuplicate: true,
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'contacts',
      type: 'text',
    },
  ],
};

export default Customers;
