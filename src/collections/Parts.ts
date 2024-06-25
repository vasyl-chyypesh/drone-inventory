import { CollectionConfig } from 'payload/types';
import { adminOnly } from '../access/adminOnly';

export enum PartType {
  Frame = 'Frame',
  Propellers = 'Propellers',
  Motors = 'Motors',
  FlightController = 'Flight Controller',
  ESC = 'ESC',
  Camera = 'Camera',
  VideoTransmitter = 'Video Transmitter',
  AntennaVideo = 'Antenna Video',
  AntennaRadio = 'Antenna Radio',
  Battery = 'Battery',
}

const Parts: CollectionConfig = {
  slug: 'parts',
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'name',
    description: 'Drone parts',
    defaultColumns: ['partType', 'name', 'description'],
  },
  timestamps: true,
  fields: [
    {
      name: 'partType',
      type: 'select',
      required: true,
      options: Object.values(PartType),
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
};

export default Parts;
