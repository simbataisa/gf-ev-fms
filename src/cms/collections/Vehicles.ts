import { CollectionConfig } from 'payload/types';

const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'model',
      type: 'text',
      required: true,
    },
    {
      name: 'manufacturer',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'licensePlate',
      type: 'text',
      required: true,
    },
    {
      name: 'vin',
      type: 'text',
      required: true,
    },
    {
      name: 'batteryCapacity',
      type: 'number',
      required: true,
    },
    {
      name: 'range',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Available',
          value: 'available',
        },
        {
          label: 'In Use',
          value: 'in-use',
        },
        {
          label: 'Charging',
          value: 'charging',
        },
        {
          label: 'Maintenance',
          value: 'maintenance',
        },
        {
          label: 'Out of Service',
          value: 'out-of-service',
        },
      ],
      defaultValue: 'available',
      required: true,
    },
    {
      name: 'currentCharge',
      type: 'number',
      min: 0,
      max: 100,
      required: true,
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'latitude',
          type: 'number',
        },
        {
          name: 'longitude',
          type: 'number',
        },
        {
          name: 'address',
          type: 'text',
        },
      ],
    },
  ],
};

export default Vehicles;