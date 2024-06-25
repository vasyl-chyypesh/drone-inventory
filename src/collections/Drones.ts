import { CollectionConfig } from 'payload/types';
import { adminOnly } from '../access/adminOnly';
import { PartType } from './Parts';

const Drones: CollectionConfig = {
  slug: 'drones',
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'name',
    description: 'Drone instances',
    defaultColumns: ['name', 'description', 'customer'],
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'The unique drone identifier.',
      },
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      hasMany: false,
    },
  ],
};

Object.values(PartType).forEach((partType) => {
  Drones.fields.push({
    name: partType,
    type: 'relationship',
    relationTo: 'parts',
    hasMany: false,
    filterOptions: {
      partType: { equals: partType },
    },
  });
});

export default Drones;
