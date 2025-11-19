# Implementación de Autenticación JWT en el Backend

## ⚠️ IMPORTANTE: Configuración de Seguridad Requerida

Para completar la seguridad del sistema, necesitas implementar lo siguiente en tu backend C# / ASP.NET Core:

---

## 1. Configurar Middleware de Autenticación JWT

En tu archivo `Program.cs` o `Startup.cs`, agrega la configuración de JWT:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// En Program.cs (después de var builder = WebApplication.CreateBuilder(args);)

// Configurar JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? 
            throw new Exception("Falta Jwt:Key en appsettings.json"))
        ),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true, // IMPORTANTE: Validar que el token no haya expirado
        ClockSkew = TimeSpan.Zero // No permitir margen de tiempo adicional
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Después de var app = builder.Build();

app.UseAuthentication(); // ANTES de UseAuthorization
app.UseAuthorization();
```

---

## 2. Proteger los Endpoints con [Authorize]

Agrega el atributo `[Authorize]` a todos los endpoints que requieren autenticación:

```csharp
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    // Endpoint público (login)
    [AllowAnonymous]
    [HttpPost("admin/login")]
    public IActionResult AdminLogin([FromBody] LoginModel request)
    {
        // ... tu código actual ...
    }

    // ENDPOINTS PROTEGIDOS - Agregar [Authorize]
    
    [Authorize] // 👈 AGREGAR ESTO
    [HttpGet("{companyId}/users")]
    public IActionResult GetUsers(int companyId)
    {
        // Obtener el userId del token
        var userIdClaim = User.FindFirst("UserAdminId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("Token inválido");

        // ... tu código actual ...
    }

    [Authorize] // 👈 AGREGAR ESTO
    [HttpPut("{companyId}/UpdateUsers/{id}")]
    public IActionResult UpdateUser(int companyId, int id, [FromBody] User model)
    {
        // Validar que el usuario autenticado pertenezca a la empresa
        var userIdClaim = User.FindFirst("UserAdminId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("Token inválido");

        // ... tu código actual ...
    }

    [Authorize] // 👈 AGREGAR ESTO
    [HttpDelete("{companyId}/DeleteUsers/{id}")]
    public IActionResult DeleteUser(int companyId, int id)
    {
        // Validar que el usuario autenticado pertenezca a la empresa
        var userIdClaim = User.FindFirst("UserAdminId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("Token inválido");

        // ... tu código actual ...
    }
}
```

---

## 3. Validar que el Token Existe en la Base de Datos (Opcional pero Recomendado)

Puedes crear un filtro personalizado para validar que el token no haya sido eliminado de la tabla `user_admin_tokens`:

```csharp
using Microsoft.AspNetCore.Mvc.Filters;

public class ValidateTokenFilter : IAsyncActionFilter
{
    private readonly YourDbContext _context;

    public ValidateTokenFilter(YourDbContext context)
    {
        _context = context;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Obtener el token del header
        var token = context.HttpContext.Request.Headers["Authorization"]
            .FirstOrDefault()?.Replace("Bearer ", "");

        if (!string.IsNullOrEmpty(token))
        {
            // Verificar si el token existe en la base de datos
            var tokenExists = _context.Database
                .SqlQueryRaw<int>($"SELECT COUNT(*) FROM user_admin_tokens WHERE token = '{token}'")
                .FirstOrDefault() > 0;

            if (!tokenExists)
            {
                context.Result = new UnauthorizedObjectResult("Token inválido o revocado");
                return;
            }
        }

        await next();
    }
}

// Registrar el filtro en Program.cs
builder.Services.AddScoped<ValidateTokenFilter>();
builder.Services.AddControllers(options =>
{
    options.Filters.AddService<ValidateTokenFilter>();
});
```

---

## 4. Endpoint de Logout (Eliminar Token)

Implementa un endpoint para hacer logout y eliminar el token de la base de datos:

```csharp
[Authorize]
[HttpPost("admin/logout")]
public IActionResult AdminLogout()
{
    // Obtener el token del header
    var token = Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
    
    if (string.IsNullOrEmpty(token))
        return BadRequest("No se proporcionó token");

    // Eliminar el token de la base de datos
    _context.Database.ExecuteSqlRaw(
        "DELETE FROM user_admin_tokens WHERE token = {0}", token);
    _context.SaveChanges();

    return Ok("Sesión cerrada correctamente");
}
```

---

## 5. Configurar CORS (Si Frontend está en Puerto Diferente)

Si tu frontend está en `localhost:3000` y el backend en `localhost:5290`, necesitas configurar CORS:

```csharp
// En Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Después de var app = builder.Build();
app.UseCors("AllowFrontend");
```

---

## 6. Resumen de Cambios Necesarios

### ✅ En Program.cs:
1. Agregar `AddAuthentication` y `AddJwtBearer`
2. Agregar `app.UseAuthentication()` y `app.UseAuthorization()`
3. Configurar CORS si es necesario

### ✅ En cada Controller:
1. Agregar `[Authorize]` a todos los endpoints protegidos
2. Usar `[AllowAnonymous]` solo en el login
3. Obtener información del usuario desde `User.Claims`

### ✅ Opcional pero Recomendado:
1. Crear filtro para validar tokens en la base de datos
2. Implementar endpoint de logout
3. Agregar logs de seguridad

---

## 7. Prueba de Seguridad

Después de implementar, prueba lo siguiente:

1. **Sin token**: Intentar acceder a `/api/Companies/1/users` sin token → Debe retornar 401
2. **Token expirado**: Esperar 1 hora y intentar usar el token → Debe retornar 401
3. **Token inválido**: Usar un token falso → Debe retornar 401
4. **Token válido**: Usar un token activo → Debe retornar 200

---

## 8. Frontend ya Implementado ✅

El frontend ya está configurado para:
- ✅ Enviar el token en el header `Authorization: Bearer {token}` en todas las peticiones
- ✅ Verificar la expiración del token cada minuto
- ✅ Hacer logout automático cuando el token expira
- ✅ Redirigir al login si recibe un 401
- ✅ Proteger todas las rutas excepto `/authentication/sign-in`
- ✅ Validar token con el backend al cargar la aplicación
- ✅ Validar token en cada cambio de ruta (previene manipulación de URL)
- ✅ Detectar si el token fue modificado manualmente en localStorage
- ✅ Verificar estructura del JWT antes de usarlo

### Protección contra Manipulación de URL:
Si alguien intenta:
1. Cambiar la URL manualmente a `/empleados` sin estar autenticado → Redirige al login
2. Modificar el localStorage para simular autenticación → El token se valida con el backend
3. Usar un token expirado → Detecta la expiración y hace logout
4. Usar un token falso → El backend responde 401 y se hace logout automático

---

## ⚠️ IMPORTANTE

**SIN estas implementaciones en el backend, cualquier persona puede:**
- Acceder a cualquier endpoint sin autenticación
- Ver datos de cualquier empresa
- Modificar o eliminar usuarios sin permisos

**Implementa estos cambios INMEDIATAMENTE para asegurar tu aplicación.**
