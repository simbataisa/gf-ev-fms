import { CollectionConfig } from 'payload/types';

const MaintenanceRecords: CollectionConfig = {
  slug: 'maintenance-records',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'vehicle',
      type: 'relationship',
      relationTo: 'vehicles',
      required: true,
    },
    {
      name: 'maintenanceType',
      type: 'select',
      options: [
        {
          label: 'Routine Check',
          value: 'routine',
        },
        {
          label: 'Battery Service',
          value: 'battery',
        },
        {
          label: 'Tire Replacement',
          value: 'tire',
        },
        {
          label: 'Software Update',
          value: 'software',
        },
        {
          label: 'Repair',
          value: 'repair',
        },
      ],
      required: true,
    },
    {
      name: 'scheduledDate',
      type: 'date',
      required: true,
    },
    {
      name: 'completedDate',
      type: 'date',
    },
    {
      name: 'technician',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'cost',
      type: 'number',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Scheduled',
          value: 'scheduled',
        },
        {
          label: 'In Progress',
          value: 'in-progress',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'scheduled',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
};

export default MaintenanceRecords;