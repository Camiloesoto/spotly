# Script de configuración de base de datos local
# Ejecutar: .\setup-db.ps1

Write-Host "=== Configuración de Base de Datos Seki ===" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Solicitar información
Write-Host "Necesitamos algunos datos para configurar la base de datos:" -ForegroundColor Yellow
$dbUser = Read-Host "Usuario de PostgreSQL (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "Contraseña de PostgreSQL" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

Write-Host ""
Write-Host "Creando base de datos 'seki'..." -ForegroundColor Yellow

# Paso 2: Crear base de datos
$env:PGPASSWORD = $dbPasswordPlain
$createDb = psql -U $dbUser -d postgres -c "SELECT 1 FROM pg_database WHERE datname = 'seki'" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al verificar base de datos. Verifica usuario y contraseña." -ForegroundColor Red
    exit 1
}

$dbExists = psql -U $dbUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = 'seki'" 2>&1
if ($dbExists -match "1") {
    Write-Host "Base de datos 'seki' ya existe." -ForegroundColor Green
} else {
    $result = psql -U $dbUser -d postgres -c "CREATE DATABASE seki;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Base de datos 'seki' creada exitosamente" -ForegroundColor Green
    } else {
        Write-Host "Error al crear base de datos: $result" -ForegroundColor Red
        exit 1
    }
}

# Paso 3: Crear archivo .env
Write-Host ""
Write-Host "Creando archivo .env..." -ForegroundColor Yellow

$connectionString = "postgresql://${dbUser}:${dbPasswordPlain}@localhost:5432/seki?schema=public"
$envContent = @"
DATABASE_URL="$connectionString"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NODE_ENV="development"
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
Write-Host "✓ Archivo .env creado" -ForegroundColor Green

# Paso 4: Crear tablas
Write-Host ""
Write-Host "Creando tablas en la base de datos..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Tablas creadas exitosamente" -ForegroundColor Green
} else {
    Write-Host "Error al crear tablas" -ForegroundColor Red
    exit 1
}

# Paso 5: Poblar con datos
Write-Host ""
$seed = Read-Host "¿Deseas poblar la base de datos con datos de prueba? (s/n)"
if ($seed -eq "s" -or $seed -eq "S" -or $seed -eq "y" -or $seed -eq "Y") {
    Write-Host "Poblando base de datos..." -ForegroundColor Yellow
    npm run db:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Datos de prueba insertados" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== Configuración completada ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Usuarios de prueba (si ejecutaste seed):" -ForegroundColor Yellow
Write-Host "  - Admin: admin@seki.com / admin123"
Write-Host "  - Usuario: usuario@seki.com / usuario123"
Write-Host "  - Owner: maria.gonzalez@terraza.com / owner123"
Write-Host ""
Write-Host "Para iniciar la aplicación:" -ForegroundColor Yellow
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Para ver los datos en Prisma Studio:" -ForegroundColor Yellow
Write-Host "  npm run db:studio"

