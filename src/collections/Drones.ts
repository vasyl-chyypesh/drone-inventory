import { CollectionConfig, FieldHook } from 'payload/types';
import { adminOnly } from '../access/adminOnly';
import { PartType } from './Parts';
import { evaluatePrice } from './utils/evaluatePrice';
import { MESSAGES, PRICE_INPUT_REGEX } from './utils/constants';

const getFinalPriceForPart = (partType: PartType): FieldHook => {
  return async function getFinalPrice({ data }) {
    const priceText = data[`${partType}_price`];
    if (!priceText) {
      return '';
    }
    const finalPrice = evaluatePrice(priceText);
    return finalPrice;
  };
};

const getTotalPrice: FieldHook = async ({ data }) => {
  return Object.values(PartType)
    .map((partType) => {
      const priceText = data[`${partType}_price`];
      return priceText ? parseFloat(evaluatePrice(priceText)) : 0;
    })
    .reduce((total, currentPrice) => total + currentPrice, 0);
};

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
    {
      name: 'totalPrice',
      type: 'text',
      label: 'Total Price',
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        description: 'UAH',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // Mutate the sibling data to prevent DB storage
            siblingData.totalPrice = undefined;
          },
        ],
        afterRead: [getTotalPrice],
      },
    },
  ],
};

Object.values(PartType).forEach((partType) => {
  Drones.fields.push(
    {
      name: partType,
      type: 'relationship',
      relationTo: 'parts',
      hasMany: false,
      filterOptions: {
        partType: { equals: partType },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: `${partType}_price`,
          type: 'text',
          label: 'Price',
          admin: {
            width: '20%',
          },
          validate: (value) => {
            if (!value) {
              return true;
            }
            const isValid = PRICE_INPUT_REGEX.test(value);
            if (!isValid) {
              return MESSAGES.INVALID_PRICE_INPUT;
            }
            return true;
          },
        },
        {
          name: `${partType}_finalPrice`,
          type: 'text',
          label: 'Final Price',
          access: {
            create: () => false,
            update: () => false,
          },
          admin: {
            description: 'UAH',
            readOnly: true,
            width: '10%',
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                // Mutate the sibling data to prevent DB storage
                siblingData[`${partType}_finalPrice`] = undefined;
              },
            ],
            afterRead: [getFinalPriceForPart(partType)],
          },
        },
        {
          name: `${partType}_link`,
          type: 'text',
          label: 'Link',
          admin: {
            width: '70%',
          },
        },
      ],
    },
  );
});

export default Drones;
