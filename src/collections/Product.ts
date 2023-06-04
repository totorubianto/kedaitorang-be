import { CollectionConfig } from 'payload/types';


const Products: CollectionConfig = {
    slug: 'products',
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
            name: 'price',
            type: 'number',
        },
        {
            name: 'image', // required
            type: 'upload', // required
            relationTo: 'medias', // required
        },
        {
            name: 'category', // required
            type: 'array', // required
            label: 'Category',
            fields: [ // required
              {
                name: 'category',
                label: 'Category',
                type: 'select',
                options: [
                    "Makanan",
                    "Minuman"
                ]
              },
            ],
        }
    ],
};

export default Products;
