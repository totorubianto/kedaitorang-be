import { CollectionConfig } from 'payload/types';


const Medias: CollectionConfig = {
    slug: 'medias',
    admin: {
        hidden: true,
    },
    access: {
        read: () => true
    },
    upload: {
        staticURL: '/media',
        staticDir: 'media',
        mimeTypes: ['image/*'],
    },
    fields: [

    ],
};

export default Medias;
