import payload from 'payload';
import { CollectionConfig, FieldHook } from 'payload/types';
import { adminOnly } from '../access/adminOnly';
import { PRICE_INPUT_REGEX, MESSAGES } from './utils/constants';
import { evaluatePrice } from './utils/evaluatePrice';

export enum DeliveryStatus {
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Canceled = 'Canceled',
}

const formatOrderTitle: FieldHook = async ({ data }) => {
  const marketPlace = await payload.findByID({ collection: 'market_places', id: data.marketPlace });
  const marketPlaceName = marketPlace?.name as string;
  const orderDate = (data.orderDate as string).split('T')[0];
  return `${data.description} (${marketPlaceName}) ${orderDate}`;
};

function getFinalPrice({ data }): string {
  const priceText = data['price'];
  const finalPrice = evaluatePrice(priceText);
  return parseFloat(finalPrice).toFixed(2);
}

const PartsOrders: CollectionConfig = {
  slug: 'parts_orders',
  labels: {
    singular: 'Parts order',
    plural: 'Parts orders',
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'orderTitle',
    description: 'Parts orders',
    defaultColumns: ['orderTitle', 'link', 'orderDate'],
  },
  timestamps: true,
  fields: [
    {
      name: 'orderTitle',
      label: false,
      type: 'text',
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // Mutate the sibling data to prevent DB storage
            siblingData.orderTitle = undefined;
          },
        ],
        afterRead: [formatOrderTitle],
      },
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'marketPlace',
      type: 'relationship',
      relationTo: 'market_places',
      label: 'Market place',
      hasMany: false,
      admin: {
        sortOptions: 'name',
      },
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link',
    },
    {
      name: 'orderDate',
      type: 'date',
      label: 'Order date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'deliveryStatus',
      type: 'select',
      label: 'Status',
      options: Object.values(DeliveryStatus),
      defaultValue: DeliveryStatus.Shipped,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
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
          name: 'finalPrice',
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
                siblingData['finalPrice'] = undefined;
              },
            ],
            afterRead: [
              ({ data }) => {
                return getFinalPrice({ data });
              },
            ],
          },
        },
      ],
    },
  ],
};

export default PartsOrders;
