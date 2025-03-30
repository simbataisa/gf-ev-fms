import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Vehicles from './collections/Vehicles';
import ChargingSchedules from './collections/ChargingSchedules';
import MaintenanceRecords from './collections/MaintenanceRecords';
import Reports from './collections/Reports';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Vehicles,
    ChargingSchedules,
    MaintenanceRecords,
    Reports,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: ['http://localhost:3000'],
  csrf: [
    'http://localhost:3000',
  ],
});