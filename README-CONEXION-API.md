# 🚀 Pasos para Conectar Dashboard React con API .NET

## 1. Configuración API .NET
En tu archivo `Program.cs`, actualiza el CORS:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowIonic",
        policy =>
        {
            policy.WithOrigins("http://localhost:8100", "http://localhost:8101", "http://localhost:3000") 
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});
```

## 2. Endpoints necesarios en tu API .NET
Asegúrate de tener estos controladores:

### AsistenciaController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class AsistenciaController : ControllerBase
{
    [HttpGet("estadisticas")]
    public async Task<IActionResult> GetEstadisticas()
    {
        return Ok(new {
            empleadosPresentes = 147,
            marcajesHoy = 284,
            reconocimientosExitosos = 98.5,
            empleadosActivos = 156
        });
    }
}
```

### EmpleadosController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class EmpleadosController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetEmpleados()
    {
        // Tu lógica para obtener empleados
    }
}
```

## 3. Configurar puerto de la API
En `src/services/ApiService.js`, actualiza la línea 4:
```javascript
this.baseURL = 'http://localhost:5000/api'; // Cambia 5000 por el puerto de tu API
```

## 4. Iniciar ambos proyectos
1. **API .NET**: `dotnet run`
2. **Dashboard React**: `pnpm start`

## 5. Verificar conexión
- API .NET corriendo en: `http://localhost:5000` (o tu puerto)
- Dashboard React corriendo en: `http://localhost:3000`
- Swagger UI en: `http://localhost:5000/swagger`

¡Listo! Tu dashboard ahora mostrará datos reales de tu base de datos MySQL.