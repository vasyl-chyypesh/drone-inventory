import { CollectionConfig } from 'payload/types';
import { adminOnly } from '../access/adminOnly';
import { selfOrAdmin } from '../access/selfOrAdmin';

export enum RoleType {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    description: 'Users with permission to access this admin panel.',
    defaultColumns: ['email', 'name', 'role'],
    disableDuplicate: true,
  },
  access: {
    create: adminOnly,
    read: selfOrAdmin,
    update: selfOrAdmin,
    delete: adminOnly,
  },
  timestamps: true,
  fields: [
    // Email added by default
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      saveToJWT: true,
      required: true,
      defaultValue: RoleType.Viewer,
      options: Object.values(RoleType),
      access: {
        create: ({ req }) => !!adminOnly({ req }),
        update: ({ req }) => !!adminOnly({ req }),
      },
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
    },
  ],
};

export default Users;
