import { CollectionConfig } from 'payload/types';


const Otp: CollectionConfig = {
  slug: 'otps',
  admin: {
    useAsTitle: 'name',
    hidden: true
  },
  access: {
    read: ({ req }: any) => {
      if (req.user.role === 'user') return false
      return true
    },
    create: ({ req }: any) => {
      return true
    },
    update: ({ req }: any) => {
      return true
    },

  },
  fields: [
    {
      name: 'phoneNumber',
      type: 'text',
    },
    {
      name: 'otp',
      type: 'number',
    },
    {
      name: 'expiredAt',
      type: 'date',
    },

  ],
};

export default Otp;
