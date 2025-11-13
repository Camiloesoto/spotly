import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";
import type {
  LocalRegisterPayload,
  LocalRegisterResponse,
  LoginPayload,
  OAuthProvider,
  RegisterPayload,
  Session,
} from "./types";

const AUTH_BASE = "/auth";
// Usar mock data si no hay API_URL configurada o si está explícitamente habilitado
// En desarrollo, siempre usar mock data a menos que se especifique lo contrario
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  !process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL === "http://localhost:3333/api/v1" ||
  process.env.NODE_ENV === "development";

// Helper para verificar si Prisma está disponible
async function getPrisma() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
  } catch (error) {
    return null;
  }
}

// Helper para mapear UserRole de Prisma a string
async function mapPrismaRoleToRole(role: any): Promise<"user" | "owner" | "admin"> {
  try {
    // @ts-ignore - Prisma puede no estar instalado
    const prismaModule = await import("@prisma/client");
    if (prismaModule?.UserRole) {
      const PrismaUserRole = prismaModule.UserRole;
      switch (role) {
        case PrismaUserRole.ADMIN:
          return "admin";
        case PrismaUserRole.OWNER:
          return "owner";
        case PrismaUserRole.USER:
        default:
          return "user";
      }
    }
  } catch {
    // Fallback si Prisma no está disponible
  }
  // Fallback por valor
  if (role === "ADMIN" || role === "admin") return "admin";
  if (role === "OWNER" || role === "owner") return "owner";
  return "user";
}

// Helper para mapear string a UserRole de Prisma
async function mapRoleToPrismaRole(role: "user" | "owner" | "admin"): Promise<any> {
  try {
    // @ts-ignore - Prisma puede no estar instalado
    const prismaModule = await import("@prisma/client");
    if (prismaModule?.UserRole) {
      const PrismaUserRole = prismaModule.UserRole;
      switch (role) {
        case "admin":
          return PrismaUserRole.ADMIN;
        case "owner":
          return PrismaUserRole.OWNER;
        case "user":
        default:
          return PrismaUserRole.USER;
      }
    }
  } catch {
    // Fallback si Prisma no está disponible
  }
  // Fallback por valor
  return role.toUpperCase();
}

// Simular usuarios en memoria (solo para desarrollo)
const MOCK_USERS: Array<{
  email: string;
  password: string;
  fullName: string;
  role: "user" | "owner" | "admin";
  id: string;
}> = [
  // Usuario admin de prueba
  {
    id: "admin_001",
    email: "admin@seki.com",
    password: "admin123",
    fullName: "Administrador Seki",
    role: "admin",
  },
  // Usuarios regulares de prueba
  {
    id: "user_001",
    email: "usuario@seki.com",
    password: "usuario123",
    fullName: "Juan Pérez",
    role: "user",
  },
  {
    id: "user_002",
    email: "maria@seki.com",
    password: "maria123",
    fullName: "María Rodríguez",
    role: "user",
  },
  {
    id: "user_003",
    email: "carlos@seki.com",
    password: "carlos123",
    fullName: "Carlos Martínez",
    role: "user",
  },
  // Usuarios owner (coinciden con solicitudes existentes)
  {
    id: "owner_001",
    email: "maria.gonzalez@terraza.com",
    password: "owner123",
    fullName: "María González",
    role: "owner",
  },
  {
    id: "owner_002",
    email: "carlos.ramirez@rincon.com",
    password: "owner123",
    fullName: "Carlos Ramírez",
    role: "owner",
  },
  {
    id: "owner_003",
    email: "andres.lopez@neon.com",
    password: "owner123",
    fullName: "Andrés López",
    role: "owner",
  },
  // Usuario owner sin solicitud (para probar el flujo completo)
  {
    id: "owner_004",
    email: "nuevo.owner@seki.com",
    password: "owner123",
    fullName: "Nuevo Owner",
    role: "owner",
  },
];

function createMockSession(user: { email: string; fullName: string; role: "user" | "owner" | "admin"; id: string }): Session {
  return {
    accessToken: `mock_token_${user.id}_${Date.now()}`,
    refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
    expiresIn: 3600,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

export async function registerUser(payload: RegisterPayload) {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new Error("Este correo electrónico ya está registrado");
      }

      // Crear nuevo usuario
      const role = await mapRoleToPrismaRole(payload.role);
      const newUser = await prisma.user.create({
        data: {
          email: payload.email,
          password: payload.password, // En producción esto debe estar hasheado (bcrypt)
          name: payload.fullName,
          role,
        },
      });

      const mappedRole = await mapPrismaRoleToRole(newUser.role);
      const session: Session = {
        accessToken: `token_${newUser.id}_${Date.now()}`,
        refreshToken: `refresh_${newUser.id}_${Date.now()}`,
        expiresIn: 3600,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.name,
          role: mappedRole,
          avatarUrl: newUser.avatarUrl || undefined,
        },
      };

      useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
      return session;
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Verificar si el usuario ya existe
    const existingUser = MOCK_USERS.find((u) => u.email === payload.email);
    if (existingUser) {
      throw new Error("Este correo electrónico ya está registrado");
    }

    // Crear nuevo usuario
    const newUser = {
      id: `user_${Date.now()}`,
      email: payload.email,
      password: payload.password, // En producción esto estaría hasheado
      fullName: payload.fullName,
      role: payload.role,
    };

    MOCK_USERS.push(newUser);
    const session = createMockSession(newUser);
    useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
    return session;
  }

  const session = await apiClient.post<Session>(`${AUTH_BASE}/register`, payload);
  useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
  return session;
}

export async function registerLocal(payload: LocalRegisterPayload): Promise<LocalRegisterResponse | Session> {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Crear una solicitud de restaurante en lugar de crear directamente el usuario
    const { createRestaurantRequest } = await import("@/modules/restaurant-requests/service");
    const request = await createRestaurantRequest({
      name: payload.name,
      description: payload.description,
      address: payload.address,
      city: payload.city,
      country: payload.country,
      phone: payload.phone,
      categories: payload.categories,
      priceRange: payload.priceRange,
      musicStyles: payload.musicStyles,
      schedule: payload.schedule,
      contactName: payload.contactName,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
    });

    // Retornar un mensaje de éxito (no creamos sesión automáticamente)
    // El usuario será notificado cuando su solicitud sea aprobada
    return {
      success: true,
      message: "Solicitud enviada correctamente. Serás notificado cuando sea revisada.",
      requestId: request.id,
    };
  }

  const session = await apiClient.post<Session>(`${AUTH_BASE}/register/local`, payload);
  useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
  return session;
}

export async function login(payload: LoginPayload) {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      // Buscar usuario
      const user = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user || user.password !== payload.password) {
        throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
      }

      const mappedRole = await mapPrismaRoleToRole(user.role);
      const session: Session = {
        accessToken: `token_${user.id}_${Date.now()}`,
        refreshToken: `refresh_${user.id}_${Date.now()}`,
        expiresIn: 3600,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.name,
          role: mappedRole,
          avatarUrl: user.avatarUrl || undefined,
        },
      };

      useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
      return session;
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Buscar usuario
    const user = MOCK_USERS.find((u) => u.email === payload.email);
    if (!user || user.password !== payload.password) {
      throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
    }

    const session = createMockSession(user);
    useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
    return session;
  }

  const session = await apiClient.post<Session>(`${AUTH_BASE}/login`, payload);
  useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
  return session;
}

export async function loginWithProvider(provider: OAuthProvider) {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // En modo mock, mostrar mensaje informativo
    throw new Error("Login con Google no está disponible en modo demo. Por favor, usa email y contraseña.");
  }

  const redirect =
    typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

  return apiClient.get<{ redirectUrl: string }>(`${AUTH_BASE}/oauth/${provider}`, {
    params: { redirect },
  });
}

export async function refreshSession(refreshToken: string) {
  const session = await apiClient.post<Session>(`${AUTH_BASE}/refresh`, { refreshToken });
  useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
  return session;
}

export async function logout() {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 200));
    useAuthStore.getState().clearSession();
    return;
  }

  await apiClient.post<void>(`${AUTH_BASE}/logout`);
  useAuthStore.getState().clearSession();
}

function mapSessionToStore(sessionUser: Session["user"]) {
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    name: sessionUser.fullName,
    role: sessionUser.role,
    avatarUrl: sessionUser.avatarUrl,
  };
}

/**
 * Crea un usuario owner desde una solicitud pre-aprobada
 * En producción, esto generaría un token de activación y enviaría un email
 */
export async function createOwnerFromRequest(request: {
  contactEmail: string;
  contactName: string;
  contactPhone: string;
}): Promise<{ userId: string; activationToken: string }> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: request.contactEmail },
      });

      if (existingUser) {
        // Si ya existe, retornar su ID (no crear duplicado)
        const activationToken = `activation_${existingUser.id}_${Date.now()}`;
        return {
          userId: existingUser.id,
          activationToken,
        };
      }

      // Crear nuevo usuario owner
      // @ts-ignore - Prisma puede no estar instalado
      const prismaModule = await import("@prisma/client");
      const ownerRole = prismaModule?.UserRole?.OWNER || "OWNER";
      const newUser = await prisma.user.create({
        data: {
          email: request.contactEmail,
          password: "temp_password", // El usuario deberá definir su contraseña al activar
          name: request.contactName,
          phone: request.contactPhone,
          role: ownerRole,
        },
      });

      // Generar token de activación (mock)
      const activationToken = `activation_${newUser.id}_${Date.now()}`;

      // En producción, aquí se enviaría un email con el token
      console.log(`[PRISMA] Email de activación enviado a ${request.contactEmail}`);
      console.log(`[PRISMA] Token de activación: ${activationToken}`);
      console.log(`[PRISMA] Link de activación: /auth/activate?token=${activationToken}`);

      return {
        userId: newUser.id,
        activationToken,
      };
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  // Fallback a mock data
  const existingUser = MOCK_USERS.find((u) => u.email === request.contactEmail);
  if (existingUser) {
    // Si ya existe, retornar su ID (no crear duplicado)
    return {
      userId: existingUser.id,
      activationToken: `mock_activation_${existingUser.id}_${Date.now()}`,
    };
  }

  // Crear nuevo usuario owner
  const newUser = {
    id: `owner_${Date.now()}`,
    email: request.contactEmail,
    password: "temp_password", // El usuario deberá definir su contraseña al activar
    fullName: request.contactName,
    role: "owner" as const,
  };

  MOCK_USERS.push(newUser);

  // Generar token de activación (mock)
  const activationToken = `mock_activation_${newUser.id}_${Date.now()}`;

  // En producción, aquí se enviaría un email con el token
  console.log(`[MOCK] Email de activación enviado a ${request.contactEmail}`);
  console.log(`[MOCK] Token de activación: ${activationToken}`);
  console.log(`[MOCK] Link de activación: /auth/activate?token=${activationToken}`);

  return {
    userId: newUser.id,
    activationToken,
  };
}

