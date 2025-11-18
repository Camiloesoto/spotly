# Script para crear archivo .env
Write-Host "=== Crear archivo .env ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTA: El usuario por defecto de PostgreSQL suele ser 'postgres'" -ForegroundColor Yellow
Write-Host ""

$dbUser = Read-Host "Usuario de PostgreSQL (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "Contraseña de PostgreSQL" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

# Verificar conexión antes de crear el archivo
Write-Host ""
Write-Host "Verificando conexión..." -ForegroundColor Yellow
$env:PGPASSWORD = $dbPasswordPlain
$testConnection = psql -U $dbUser -d seki -c "SELECT 1;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: No se pudo conectar a la base de datos" -ForegroundColor Red
    Write-Host "Verifica que el usuario y contraseña sean correctos" -ForegroundColor Red
    Write-Host ""
    Write-Host "Intenta con el usuario 'postgres' si no estás seguro" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Conexión exitosa" -ForegroundColor Green
Write-Host ""

$connectionString = "postgresql://${dbUser}:${dbPasswordPlain}@localhost:5432/seki?schema=public"
$envContent = @"
DATABASE_URL="$connectionString"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NODE_ENV="development"
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8
Write-Host "[OK] Archivo .env creado exitosamente" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes ejecutar:" -ForegroundColor Yellow
Write-Host "  npm run db:push    # Crear tablas"
Write-Host "  npm run db:seed    # Poblar con datos (opcional)"
