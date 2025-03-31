import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
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
    const user = await prisma.user.create({
      data: {
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
    
    const vehicle = await prisma.vehicle.create({
      data: {
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
    console.log(`Vehicle created: ${vehicle.name} with battery level: ${batteryLevel}%`);
  }
  
  // Create charging schedules
  for (let i = 0; i < dummyCount; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + i);
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);
    
    const charging = await prisma.chargingSchedule.create({
      data: {
        title: `Charging Session ${i + 1}`,
        vehicleId: vehicles[i % vehicles.length].id,
        scheduledStart: startDate,
        scheduledEnd: endDate,
        chargingStation: chargingStations[i % chargingStations.length],
        targetChargeLevel: 80 + (i % 20),
        status: chargingStatuses[i % chargingStatuses.length],
        notes: i % 3 === 0 ? `Priority charging for vehicle ${i + 1}` : null,
      },
    });
    console.log(`Charging schedule created: ${charging.title}`);
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
    
    const maintenance = await prisma.maintenanceRecord.create({
      data: {
        title: `Maintenance ${i + 1}`,
        vehicleId: vehicles[i % vehicles.length].id,
        maintenanceType: maintenanceTypes[i % maintenanceTypes.length],
        scheduledDate,
        completedDate,
        cost: i % 2 === 0 ? 100 + (i * 25) : null,
        status: maintenanceStatuses[i % maintenanceStatuses.length],
        notes: i % 4 === 0 ? `Important maintenance note for vehicle ${i + 1}` : null,
      },
    });
    console.log(`Maintenance record created: ${maintenance.title}`);
  }
  
  // Create reports
  for (let i = 0; i < dummyCount; i++) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    
    const endDate = new Date();
    
    const report = await prisma.report.create({
      data: {
        title: `${reportTypes[i % reportTypes.length].charAt(0).toUpperCase() + reportTypes[i % reportTypes.length].slice(1)} Report ${i + 1}`,
        reportType: reportTypes[i % reportTypes.length],
        startDate,
        endDate,
        generatedBy: i % 4 === 0 ? admin.id : users[i % users.length].id,
        summary: `Summary of ${reportTypes[i % reportTypes.length]} data for the past month.`,
      },
    });
    console.log(`Report created: ${report.title}`);
  }
  
  // Create paperwork records for vehicle onboarding
  const paperworkStatuses = [
    'Purchase Documentation', 
    'Registration', 
    'Insurance Processing', 
    'Tax Clearance',
    'Emissions Testing', 
    'Number Plate Issuance', 
    'Telematics Setup', 
    'Final Inspection',
    'Driver Assignment', 
    'Fleet Integration'
  ];
  
  const assignees = [
    'John Smith',
    'Maria Garcia',
    'Robert Chen',
    'Sarah Johnson',
    'David Wilson',
    'Emily Brown',
    'Michael Lee',
    'Jessica Martinez'
  ];
  
  const nextSteps = [
    'Vendor Payment Confirmation',
    'DMV Appointment',
    'Policy Approval',
    'Tax Certificate',
    'Test Results Review',
    'Plate Installation',
    'System Testing',
    'Fleet Onboarding',
    'Driver Training',
    'Final Documentation'
  ];
  
  // Create paperwork records for some vehicles
  for (let i = 0; i < Math.min(dummyCount, 8); i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (10 + i * 5)); // Stagger start dates
    
    const estimatedCompletion = new Date(startDate);
    estimatedCompletion.setDate(startDate.getDate() + 15); // 15 days to complete
    
    // Calculate progress based on time elapsed
    const today = new Date();
    const totalDays = 15;
    const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    let progress = Math.min(Math.floor((daysElapsed / totalDays) * 100), 95);
    
    // Randomize progress a bit
    progress = Math.max(10, Math.min(95, progress + (Math.floor(Math.random() * 20) - 10)));
    
    // Select status based on progress
    const statusIndex = Math.floor((progress / 100) * paperworkStatuses.length);
    const status = paperworkStatuses[Math.min(statusIndex, paperworkStatuses.length - 1)];
    
    // Select next step based on status
    const nextStepIndex = paperworkStatuses.indexOf(status);
    const nextStep = nextStepIndex < paperworkStatuses.length - 1 
      ? `Prepare for ${paperworkStatuses[nextStepIndex + 1]}` 
      : nextSteps[Math.floor(Math.random() * nextSteps.length)];
    
    const paperwork = await prisma.paperwork.create({
      data: {
        vehicleId: `EV-${1000 + i}`,
        status,
        startDate,
        estimatedCompletion,
        progress,
        assignedTo: assignees[i % assignees.length],
        nextStep,
      },
    });
    
    console.log(`Paperwork record created for ${paperwork.vehicleId} (${status}) - ${progress}% complete`);
  }
  
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });