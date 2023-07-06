import { CollectionAfterChangeHook, CollectionConfig } from 'payload/types';

const afterChangeHook: CollectionAfterChangeHook = async ({
    doc, // full document data
    req, // full express request
    previousDoc, // document data before updating the collection
    operation, // name of the operation ie. 'create', 'update'
  }: any) => {
    console.log(doc.status)
    console.log(req.clientWA)
    if (req.clientWA) {
        if (doc.status == "sedang_diproses") {
            req.clientWA.sendMessage(doc.phonenumber + "@c.us", "Pesanan anda sedang di proses mohon untuk menunggu")
                .then(response => { console.log("berhasil")})
                .catch(error => {console.log(error, "err")});
        } else if(doc.status == "sudah_siap") {
            req.clientWA.sendMessage(doc.phonenumber + "@c.us", `Pesanan sudah berhasil dibuat, silahkan ambil di loker *${doc.notes}*`)
                .then(response => { console.log("berhasil")})
                .catch(error => {console.log(error, "err")});
        }
    }
   
    
    return doc;
  }

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
            name: 'orderId',
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
            label: "loker",
            type: 'textarea',
            access: { 
                read: () => true, 
                update: () => true
            }
        },
        {
            name: 'status',
            type: 'select',
            options: [
                'belum_dibayar',
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
    hooks: {
        afterChange: [(args) => afterChangeHook(args)],
        
    }
};

export default Orders;
