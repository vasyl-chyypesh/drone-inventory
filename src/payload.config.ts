import path from 'path';

import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';
import { buildConfig } from 'payload/config';

import Drones from './collections/Drones';
import Parts from './collections/Parts';
import Customers from './collections/Customers';
import Users from './collections/Users';

import { Logo } from './components/graphics/Logo';
import { Icon } from './components/graphics/Icon';

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Drone Inventory',
      favicon: '/assets/favicon.svg',
      ogImage: '/assets/logo.svg',
    },
    components: {
      graphics: {
        Logo,
        Icon,
      },
    },
  },
  editor: slateEditor({}),
  collections: [Drones, Parts, Customers, Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    disable: true,
  },
  plugins: [],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
