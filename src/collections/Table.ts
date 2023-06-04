import { CollectionConfig } from 'payload/types';


const Table: CollectionConfig = {
  slug: 'table',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req }: any) => {
      if (req.user.role === 'user') return false
      return true
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'nomor',
      type: 'number',
    },
    {
      name: 'capacity',
      type: 'number',
    },
    {
      name: 'isAvailabel', // required
      type: 'radio', // required
      options: [ // required
        {
          label: 'Yes',
          value: 'AVAIL',
        },
        {
          label: 'No',
          value: 'NO_AVAIL',
        },
      ],
      defaultValue: 'AVAIL', // The first value in options.
      admin: {
        layout: 'vertical',
      }
    }

  ],
};

export default Table;
