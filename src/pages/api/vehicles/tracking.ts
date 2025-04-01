import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Fetch vehicles from database
    const vehicles = await prisma.vehicle.findMany({
      select: {
        id: true,
        name: true,
        licensePlate: true,
        status: true,
        currentCharge: true,
        drivers: {
          select: {
            firstName: true,
            lastName: true,
          },
          take: 1,
        },
      },
    });

    // Transform data for the tracking interface
    const trackingData = vehicles.map(vehicle => {
      // Vietnam locations with exact coordinates
      const vietnamLocations = [
        {
          city: 'Ho Chi Minh City',
          district: 'District 1',
          street: 'Nguyen Hue',
          lat: 10.7769,
          lng: 106.7009
        },
        {
          city: 'Hanoi',
          district: 'Hoan Kiem',
          street: 'Trang Tien',
          lat: 21.0285,
          lng: 105.8542
        },
        {
          city: 'Da Nang',
          district: 'Hai Chau',
          street: 'Bach Dang',
          lat: 16.0544,
          lng: 108.2022
        },
        {
          city: 'Nha Trang',
          district: 'Nha Trang',
          street: 'Tran Phu',
          lat: 12.2388,
          lng: 109.1967
        },
        {
          city: 'Can Tho',
          district: 'Ninh Kieu',
          street: 'Nguyen An Ninh',
          lat: 10.0452,
          lng: 105.7469
        }
      ];
      
      // Select a random location from Vietnam
      const randomLocation = vietnamLocations[Math.floor(Math.random() * vietnamLocations.length)];
      const randomNumber = Math.floor(100 + Math.random() * 900);
      
      // Get driver name or placeholder
      const driver = vehicle.drivers && vehicle.drivers.length > 0
        ? `${vehicle.drivers[0].firstName} ${vehicle.drivers[0].lastName}`
        : 'Unassigned';
      
      // Generate random odometer reading
      const odometer = Math.floor(5000 + Math.random() * 20000);
      
      return {
        id: vehicle.id,
        name: vehicle.name,
        licensePlate: vehicle.licensePlate,
        status: vehicle.status || 'Active',
        batteryLevel: vehicle.currentCharge || Math.floor(Math.random() * 100),
        odometer,
        location: {
          latitude: randomLocation.lat,
          longitude: randomLocation.lng,
          address: `${randomNumber} ${randomLocation.street}, ${randomLocation.district}, ${randomLocation.city}`,
          lastUpdated: new Date().toISOString()
        },
        isLocked: Math.random() > 0.3, // 70% chance of being locked
        isChargingEnabled: Math.random() > 0.2, // 80% chance of charging enabled
        lastActivity: new Date().toISOString(),
        driver
      };
    });

    res.status(200).json(trackingData);
  } catch (error) {
    console.error('Error fetching vehicle tracking data:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle tracking data' });
  }
}