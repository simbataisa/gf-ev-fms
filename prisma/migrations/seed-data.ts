import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function seedData() {
  console.log('Seeding database with initial data...');
  
  // Parse environment variables
  const dummyCount = parseInt(process.env.DUMMY_DATA_COUNT || '10');
  const vehicleModels = (process.env.DUMMY_VEHICLE_MODELS || '').split(',');
  const vehicleManufacturers = (process.env.DUMMY_VEHICLE_MANUFACTURERS || '').split(',');
  const vehicleStatuses = (process.env.DUMMY_VEHICLE_STATUSES || '').split(',');
  const chargingStations = (process.env.DUMMY_CHARGING_STATIONS || '').split(',');
  const chargingStatuses = (process.env.DUMMY_CHARGING_STATUSES || '').split(',');
  const maintenanceTypes = (process.env.DUMMY_MAINTENANCE_TYPES || '').split(',');
  const maintenanceStatuses = (process.env.DUMMY_MAINTENANCE_STATUSES || '').split(',');
  const reportTypes = (process.env.DUMMY_REPORT_TYPES || '').split(',');
  
  // Create admin user
  const adminPassword = await hash(process.env.DUMMY_ADMIN_PASSWORD || 'admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.DUMMY_ADMIN_EMAIL || 'admin@evmanagement.com' },
    update: {},
    create: {
      email: process.env.DUMMY_ADMIN_EMAIL || 'admin@evmanagement.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phoneNumber: '555-123-4567',
      address: '123 Admin St, City, State 12345',
    },
  });
  
  console.log('Admin user created:', admin.email);
  
  // Create regular users
  const userPassword = await hash(process.env.DUMMY_USER_PASSWORD || 'password123', 10);
  const roles = ['fleet-manager', 'driver', 'maintenance'];
  
  const users = [];
  for (let i = 0; i < dummyCount; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i + 1}@evmanagement.com` },
      update: {},
      create: {
        email: `user${i + 1}@evmanagement.com`,
        password: userPassword,
        firstName: `FirstName${i + 1}`,
        lastName: `LastName${i + 1}`,
        role: roles[i % roles.length],
        phoneNumber: `555-${100 + i}-${1000 + i}`,
        address: `${100 + i} Main St, City, State ${10000 + i}`,
      },
    });
    users.push(user);
    console.log(`User created: ${user.email}`);
  }
  
  // Create vehicles with various battery levels
  const vehicles = [];
  for (let i = 0; i < dummyCount; i++) {
    // Deliberately create some vehicles with low battery (< 20%)
    const batteryLevel = i % 5 === 0 ? 
      Math.floor(Math.random() * 19) + 1 :  // Low battery (1-19%)
      i % 3 === 0 ? 
        Math.floor(Math.random() * 30) + 20 :  // Medium battery (20-49%)
        Math.floor(Math.random() * 50) + 50;   // High battery (50-99%)
    
    const vehicle = await prisma.vehicle.upsert({
      where: { licensePlate: `EV-${1000 + i}` },
      update: { currentCharge: batteryLevel },
      create: {
        name: `EV-${1000 + i}`,
        model: vehicleModels[i % vehicleModels.length],
        manufacturer: vehicleManufacturers[i % vehicleManufacturers.length],
        year: 2020 + (i % 4),
        licensePlate: `EV-${1000 + i}`,
        vin: `VIN${100000 + i}`,
        batteryCapacity: 75 + (i % 25),
        range: 250 + (i * 10),
        status: vehicleStatuses[i % vehicleStatuses.length],
        currentCharge: batteryLevel,
        drivers: {
          connect: [{ id: users[i % users.length].id }],
        },
      },
    });
    vehicles.push(vehicle);
    console.log(`Vehicle created/updated: ${vehicle.name} with battery level: ${batteryLevel}%`);
  }
  
  // Create charging schedules
  for (let i = 0; i < dummyCount; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + i);
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);
    
    const chargingTitle = `Charging Session ${i + 1}`;
    
    const charging = await prisma.chargingSchedule.upsert({
      where: { id: `charging-${i + 1}` },
      update: {},
      create: {
        id: `charging-${i + 1}`,
        title: chargingTitle,
        vehicleId: vehicles[i % vehicles.length].id,
        scheduledStart: startDate,
        scheduledEnd: endDate,
        chargingStation: chargingStations[i % chargingStations.length],
        targetChargeLevel: 80 + (i % 20),
        status: chargingStatuses[i % chargingStatuses.length],
        notes: i % 3 === 0 ? `Priority charging for vehicle ${i + 1}` : null,
      },
    });
    console.log(`Charging schedule created/updated: ${charging.title}`);
  }
  
  // Create maintenance records
  for (let i = 0; i < dummyCount; i++) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + i);
    
    let completedDate = null;
    if (i % 3 === 0) {
      completedDate = new Date(scheduledDate);
      completedDate.setDate(completedDate.getDate() + 1);
    }
    
    const maintenanceTitle = `Maintenance ${i + 1}`;
    
    const maintenance = await prisma.maintenanceRecord.upsert({
      where: { id: `maintenance-${i + 1}` },
      update: {},
      create: {
        id: `maintenance-${i + 1}`,
        title: maintenanceTitle,
        vehicleId: vehicles[i % vehicles.length].id,
        maintenanceType: maintenanceTypes[i % maintenanceTypes.length],
        scheduledDate,
        completedDate,
        cost: i % 2 === 0 ? 100 + (i * 25) : null,
        status: maintenanceStatuses[i % maintenanceStatuses.length],
        notes: i % 4 === 0 ? `Important maintenance note for vehicle ${i + 1}` : null,
      },
    });
    console.log(`Maintenance record created/updated: ${maintenance.title}`);
  }
  
  // Create reports
  for (let i = 0; i < dummyCount; i++) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    
    const endDate = new Date();
    
    const reportTitle = `${reportTypes[i % reportTypes.length].charAt(0).toUpperCase() + reportTypes[i % reportTypes.length].slice(1)} Report ${i + 1}`;
    
    const report = await prisma.report.upsert({
      where: { id: `report-${i + 1}` },
      update: {},
      create: {
        id: `report-${i + 1}`,
        title: reportTitle,
        reportType: reportTypes[i % reportTypes.length],
        startDate,
        endDate,
        generatedBy: i % 4 === 0 ? admin.id : users[i % users.length].id,
        summary: `Summary of ${reportTypes[i % reportTypes.length]} data for the past month.`,
      },
    });
    console.log(`Report created/updated: ${report.title}`);
  }
  
  console.log('Database seeding completed!');
}

seedData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });