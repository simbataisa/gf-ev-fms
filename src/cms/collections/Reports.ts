import { CollectionConfig } from 'payload/types';

const Reports: CollectionConfig = {
  slug: 'reports',
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
      name: 'reportType',
      type: 'select',
      options: [
        {
          label: 'Vehicle Usage',
          value: 'usage',
        },
        {
          label: 'Charging Efficiency',
          value: 'charging',
        },
        {
          label: 'Maintenance Cost',
          value: 'maintenance',
        },
        {
          label: 'Fleet Overview',
          value: 'fleet',
        },
      ],
      required: true,
    },
    {
      name: 'dateRange',
      type: 'group',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'generatedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'data',
      type: 'json',
    },
    {
      name: 'summary',
      type: 'textarea',
    },
  ],
};

export default Reports;