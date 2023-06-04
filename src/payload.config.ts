import { buildConfig } from 'payload/config';
import path from 'path';
// import Examples from './collections/Examples';
import Users from './collections/Users';
import Products from './collections/Product';
import Medias from './collections/Media';
import Orders from './collections/Order';
import Reservation from './collections/Reservation';
import Table from './collections/Table';
import Otp from './collections/Otp';
import { Logo } from "./Logo"

export default buildConfig({
  serverURL: 'https://kedaitorang.site',
  admin: {
    user: Users.slug,
    meta: {
      ogImage: '/assets/logo.svg',
    },
    components: {
      graphics: {
        Logo
      },
    },
  },
  collections: [
    Users,
    Products,
    Medias,
    Orders,
    Reservation,
    Table,
    Otp
    // Add Collections here
    // Examples,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
})
