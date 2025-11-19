# Configuración API .NET para Dashboard React

## 1. Actualizar CORS en Program.cs

Cambiar esta línea:
```csharp
policy.WithOrigins("http://localhost:8100", "http://localhost:8101") 
```

Por esta:
```csharp
policy.WithOrigins("http://localhost:8100", "http://localhost:8101", "http://localhost:3000") 
```

## 2. Código completo actualizado:

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

El puerto 3000 es donde corre tu dashboard React.