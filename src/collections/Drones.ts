import { CollectionConfig, FieldHook } from 'payload/types';
import { adminOnly } from '../access/adminOnly';
import { PartType } from './Parts';
import { evaluatePrice } from './utils/evaluatePrice';
import { MESSAGES, PRICE_INPUT_REGEX } from './utils/constants';
import { RowLabelArgs } from 'payload/dist/admin/components/forms/RowLabel/types';

const getTotalPrice: FieldHook = async ({ data }) => {
  return data.parts
    ?.map((part) => {
      const priceText = part['price'];
      return priceText ? parseFloat(evaluatePrice(priceText)) : 0;
    })
    ?.reduce((total: number, currentPrice: number) => total + currentPrice, 0)
    .toFixed(2);
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
    {
      name: 'parts',
      type: 'array',
      admin: {
        components: {
          RowLabel: ({ data, index }: RowLabelArgs) => {
            return data?.partType || `Part ${String(index).padStart(2, '0')}`;
          },
        },
      },
      fields: [
        {
          name: 'partType',
          type: 'select',
          required: true,
          options: Object.values(PartType),
        },
        {
          name: 'partName',
          type: 'relationship',
          relationTo: 'parts',
          required: true,
          hasMany: false,
          filterOptions: ({ siblingData }) => {
            if ((<any>siblingData).partType) {
              return {
                partType: { equals: (<any>siblingData).partType },
              };
            }
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'price',
              type: 'text',
              label: 'Price',
              admin: {
                width: '30%',
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
              name: 'partsOrder',
              type: 'relationship',
              relationTo: 'parts_orders',
              label: 'Order',
              hasMany: false,
              admin: {
                width: '70%',
                sortOptions: 'orderDate',
              },
            },
          ],
        },
      ],
    },
  ],
};

export default Drones;
