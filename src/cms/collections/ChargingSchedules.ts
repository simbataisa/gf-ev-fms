import { CollectionConfig } from 'payload/types';

const ChargingSchedules: CollectionConfig = {
  slug: 'charging-schedules',
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
      name: 'scheduledStart',
      type: 'date',
      required: true,
    },
    {
      name: 'scheduledEnd',
      type: 'date',
      required: true,
    },
    {
      name: 'chargingStation',
      type: 'text',
      required: true,
    },
    {
      name: 'targetChargeLevel',
      type: 'number',
      min: 0,
      max: 100,
      required: true,
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

export default ChargingSchedules;