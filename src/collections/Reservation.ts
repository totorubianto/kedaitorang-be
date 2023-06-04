import { CollectionConfig } from 'payload/types';


const Reservation: CollectionConfig = {
    slug: 'reservation',
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
            name: 'phoneNumber',
            type: 'text',
        },
        {
            name: 'table', // required
            type: 'relationship', // required
            relationTo: 'table', // required
            hasMany: false,
        },
        {
            name: "dateOnly",
            type: "date",
            admin: {
              date: {
                pickerAppearance: "dayOnly",
                displayFormat: "d MMM yyy",
              },
            },
        },
        {
            name: "timeOnly",
            type: "date",
            admin: {
              date: {
                pickerAppearance: "timeOnly",
                displayFormat: "h:mm",
              },
            },
        },
    ],
};

export default Reservation;
