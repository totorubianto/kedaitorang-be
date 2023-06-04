import { CollectionConfig } from 'payload/types';


const Orders: CollectionConfig = {
    slug: 'orders',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        create: ({ req }: any) => {
            if (req.user.role === 'user') return true
            return false
        }
    },
    fields: [
        {
            name: 'phonenumber',
            type: 'text',
            access: { 
                read: () => true, 
                update: () => false
            }
        },
        {
            name: 'price',
            type: 'number',
            access: { 
                read: () => true, 
                update: () => false
            }
        },
        {
            name: 'notes',
            type: 'textarea',
            access: { 
                read: () => true, 
                update: () => false
            }
        },
        {
            name: 'status',
            type: 'select',
            options: [
                'sedang_diproses',
                'sudah_siap',
                'digagalkan',
            ]
        },
        {
            name: 'products',
            type: 'array',
            access: { 
                read: () => true, 
                update: () => false
            },
            fields: [
                {
                    name: 'product',
                    type: 'relationship',
                    relationTo: 'products',
                },
                {
                    name: 'quantity',
                    type: 'number',
                },
            ],
        }
    ],
};

export default Orders;
