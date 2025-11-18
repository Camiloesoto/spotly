// Import dinámico de Prisma para evitar errores si no está instalado
let PrismaClient: any = null;
let prismaInstance: any = null;

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

// Función para obtener Prisma de forma segura
export async function getPrismaClient() {
  // Si ya tenemos una instancia, retornarla
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  // Intentar importar Prisma solo si está disponible
  try {
    if (!PrismaClient) {
      const prismaModule = await import("@prisma/client");
      PrismaClient = prismaModule.PrismaClient;
    }

    if (PrismaClient && !prismaInstance) {
      prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
      globalForPrisma.prisma = prismaInstance;
    }

    return prismaInstance;
  } catch (error) {
    // Si Prisma no está instalado, retornar null
    return null;
  }
}

// Exportar prisma como una propiedad lazy para compatibilidad
export const prisma = new Proxy({} as any, {
  get: function (target, prop) {
    // Si se accede a prisma antes de que esté inicializado, retornar null
    return globalForPrisma.prisma?.[prop] || null;
  },
});

