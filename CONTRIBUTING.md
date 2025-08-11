# Contribuyendo a Spotly

¡Gracias por tu interés en contribuir a Spotly! Este documento te guiará a través del proceso de contribución.

## 🚀 Cómo empezar

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- PostgreSQL
- Git

### Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/spotly.git
   cd spotly
   ```

2. Instala todas las dependencias:
   ```bash
   npm run install:all
   ```

3. Configura las variables de entorno:
   - Copia `backend/env.example` a `backend/.env`
   - Configura tu base de datos PostgreSQL

4. Ejecuta las migraciones:
   ```bash
   npm run migrate
   ```

## 🏗️ Estructura del proyecto

```
spotly/
├── backend/          # API REST con Node.js + Express
├── mobile/           # App móvil con React Native + Expo
├── spotly-admin/     # Panel administrativo web con React + Vite
├── docs/             # Documentación del proyecto
└── scripts/          # Scripts de utilidad
```

## 🧪 Ejecutar el proyecto

### Desarrollo local
```bash
# Ejecutar solo el backend
npm run dev:backend

# Ejecutar solo la app móvil
npm run dev:mobile

# Ejecutar solo el panel admin
npm run dev:admin

# Ejecutar todo junto
npm run dev:all
```

### Construcción para producción
```bash
# Construir todo
npm run build:all

# Construir solo el backend
npm run build:backend
```

## 📝 Flujo de trabajo para contribuciones

1. **Fork** el repositorio
2. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```
3. **Haz commit** de tus cambios:
   ```bash
   git commit -m "feat: descripción de tu feature"
   ```
4. **Push** a tu fork:
   ```bash
   git push origin feature/nombre-de-tu-feature
   ```
5. **Crea un Pull Request**

## 📋 Convenciones de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, comas, etc.)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en build, configuraciones, etc.

## 🐛 Reportar bugs

Si encuentras un bug, por favor:

1. Verifica que no haya sido reportado ya
2. Usa el template de bug report
3. Incluye pasos para reproducir
4. Adjunta logs y capturas de pantalla si es relevante

## 💡 Solicitar features

Para solicitar nuevas funcionalidades:

1. Verifica que no haya sido solicitada ya
2. Describe claramente el caso de uso
3. Explica por qué sería útil
4. Sugiere una implementación si es posible

## 📚 Recursos adicionales

- [README.md](README.md) - Documentación principal
- [API Documentation](docs/api.md) - Documentación de la API
- [Database Schema](docs/database.md) - Esquema de la base de datos

## 🤝 Código de conducta

Este proyecto está comprometido con proporcionar un ambiente acogedor y respetuoso para todos los contribuyentes.

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto.

---

¡Gracias por contribuir a hacer de Spotly una plataforma increíble! 🎉
