import { PrismaClient, UserRole, RestaurantRequestStatus, PriceRange, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de base de datos...");

  // Limpiar datos existentes
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.place.deleteMany();
  await prisma.restaurantRequest.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  const admin = await prisma.user.create({
    data: {
      email: "admin@seki.com",
      password: "admin123", // En producción esto debe estar hasheado
      name: "Administrador Seki",
      role: UserRole.ADMIN,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: "usuario@seki.com",
      password: "usuario123",
      name: "Juan Pérez",
      role: UserRole.USER,
      phone: "+57 300 123 4567",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "maria@seki.com",
      password: "maria123",
      name: "María Rodríguez",
      role: UserRole.USER,
      phone: "+57 300 234 5678",
    },
  });

  // Crear usuarios owner
  const owner1 = await prisma.user.create({
    data: {
      email: "maria.gonzalez@terraza.com",
      password: "owner123",
      name: "María González",
      role: UserRole.OWNER,
      phone: "+57 300 123 4567",
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      email: "carlos.ramirez@rincon.com",
      password: "owner123",
      name: "Carlos Ramírez",
      role: UserRole.OWNER,
      phone: "+57 310 987 6543",
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      email: "andres.lopez@neon.com",
      password: "owner123",
      name: "Andrés López",
      role: UserRole.OWNER,
      phone: "+57 320 111 2233",
    },
  });

  // Crear solicitudes de restaurantes
  const request1 = await prisma.restaurantRequest.create({
    data: {
      status: RestaurantRequestStatus.PENDING_REVIEW,
      name: "La Terraza del Valle",
      description: "Restaurante de comida mediterránea con terraza al aire libre y vista panorámica. Ambiente relajado ideal para cenas románticas o reuniones familiares.",
      address: "Carrera 43A #1-50, El Poblado",
      city: "Medellín",
      country: "Colombia",
      phone: "+57 4 311 2345",
      categories: ["restaurant"],
      priceRange: PriceRange.HIGH,
      musicStyles: ["Jazz", "Latin"],
      schedule: [
        { day: "monday", opensAt: "12:00", closesAt: "23:00" },
        { day: "tuesday", opensAt: "12:00", closesAt: "23:00" },
        { day: "wednesday", opensAt: "12:00", closesAt: "23:00" },
        { day: "thursday", opensAt: "12:00", closesAt: "23:00" },
        { day: "friday", opensAt: "12:00", closesAt: "00:00" },
        { day: "saturday", opensAt: "12:00", closesAt: "00:00" },
        { day: "sunday", opensAt: "12:00", closesAt: "22:00" },
      ],
      contactName: "María González",
      contactEmail: "maria.gonzalez@terraza.com",
      contactPhone: "+57 300 123 4567",
      ownerUserId: owner1.id,
    },
  });

  const request2 = await prisma.restaurantRequest.create({
    data: {
      status: RestaurantRequestStatus.PENDING_REVIEW,
      name: "Bar El Rincón",
      description: "Bar temático con música en vivo los fines de semana. Especialidad en cócteles artesanales y tapas. Ambiente juvenil y desenfadado.",
      address: "Calle 10 #43-20, Laureles",
      city: "Medellín",
      country: "Colombia",
      phone: "+57 4 234 5678",
      categories: ["bar"],
      priceRange: PriceRange.MEDIUM,
      musicStyles: ["Rock", "Indie", "Electronic"],
      schedule: [
        { day: "tuesday", opensAt: "18:00", closesAt: "02:00" },
        { day: "wednesday", opensAt: "18:00", closesAt: "02:00" },
        { day: "thursday", opensAt: "18:00", closesAt: "02:00" },
        { day: "friday", opensAt: "18:00", closesAt: "03:00" },
        { day: "saturday", opensAt: "18:00", closesAt: "03:00" },
      ],
      contactName: "Carlos Ramírez",
      contactEmail: "carlos.ramirez@rincon.com",
      contactPhone: "+57 310 987 6543",
      ownerUserId: owner2.id,
    },
  });

  const request3 = await prisma.restaurantRequest.create({
    data: {
      status: RestaurantRequestStatus.PRE_APPROVED,
      name: "Discoteca Neon",
      description: "Discoteca moderna con sistema de sonido de última generación. Música electrónica y reggaeton. Eventos especiales los viernes y sábados.",
      address: "Carrera 70 #45-123, La 70",
      city: "Medellín",
      country: "Colombia",
      phone: "+57 4 567 8901",
      categories: ["club"],
      priceRange: PriceRange.HIGH,
      musicStyles: ["Electronic", "Reggaeton", "Hip-Hop"],
      schedule: [
        { day: "thursday", opensAt: "22:00", closesAt: "04:00" },
        { day: "friday", opensAt: "22:00", closesAt: "05:00" },
        { day: "saturday", opensAt: "22:00", closesAt: "05:00" },
      ],
      contactName: "Andrés López",
      contactEmail: "andres.lopez@neon.com",
      contactPhone: "+57 320 111 2233",
      ownerUserId: owner3.id,
      reviewedAt: new Date(),
      reviewedBy: admin.id,
    },
  });

  // Crear lugares publicados (ejemplos)
  const place1 = await prisma.place.create({
    data: {
      name: "La Terraza del Mar",
      description: "Restaurante de mariscos frescos con vista al valle. Ambiente relajado y música en vivo los fines de semana.",
      address: "Carrera 37A #8-50, El Poblado",
      city: "Medellín",
      country: "Colombia",
      phone: "+57 4 311 2345",
      latitude: 6.2088,
      longitude: -75.5704,
      categories: ["restaurant"],
      priceRange: PriceRange.HIGH,
      musicStyles: ["Jazz", "Latin"],
      schedule: [
        { day: "monday", opensAt: "12:00", closesAt: "23:00" },
        { day: "tuesday", opensAt: "12:00", closesAt: "23:00" },
        { day: "wednesday", opensAt: "12:00", closesAt: "23:00" },
        { day: "thursday", opensAt: "12:00", closesAt: "23:00" },
        { day: "friday", opensAt: "12:00", closesAt: "00:00" },
        { day: "saturday", opensAt: "12:00", closesAt: "00:00" },
        { day: "sunday", opensAt: "12:00", closesAt: "22:00" },
      ],
      rating: 4.7,
      distanceInKm: 2.5,
      ownerId: owner1.id,
    },
  });

  // Crear algunas reservas de ejemplo
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.booking.create({
    data: {
      placeId: place1.id,
      userId: user1.id,
      date: tomorrow,
      time: "20:00",
      numberOfGuests: 4,
      specialRequests: "Mesa cerca de la ventana, por favor",
      status: BookingStatus.CONFIRMED,
      placeName: place1.name,
    },
  });

  await prisma.booking.create({
    data: {
      placeId: place1.id,
      userId: user2.id,
      date: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
      time: "19:30",
      numberOfGuests: 2,
      status: BookingStatus.PENDING,
      placeName: place1.name,
    },
  });

  console.log("✅ Seed completado exitosamente!");
  console.log(`   - ${await prisma.user.count()} usuarios creados`);
  console.log(`   - ${await prisma.restaurantRequest.count()} solicitudes creadas`);
  console.log(`   - ${await prisma.place.count()} lugares creados`);
  console.log(`   - ${await prisma.booking.count()} reservas creadas`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

