import { GlobalConfig } from 'payload/types';

const Headers: GlobalConfig = {
  slug: "header",
  access: {
    read: ({ req: { user } }) => { 
        return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'developer'
    },
    update: ({ req: { user } }) => { 
        return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'developer'
     },
  },
  graphQL: {},
  fields: []
};

export default Headers;