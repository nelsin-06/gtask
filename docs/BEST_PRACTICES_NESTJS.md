# Mejores Prácticas de NestJS - Arquitectura por Capas

## ❌ Antes (Mal práctica)

```typescript
// ❌ Controller con lógica de negocio
@Controller('auth')
export class AuthController {
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    // ❌ Validación manual en controller
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ❌ Lógica de encriptación en controller
    const isPasswordValid = await this.authService.comparePasswords(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ❌ Generación de JWT en controller
    const payload = { sub: user.id, email: user.email, name: user.name };
    const token = this.jwtService.sign(payload);

    return { token, user: { ... } };
  }
}
```

## ✅ Después (Buenas prácticas)

### 1. **Controller - Solo HTTP y Delegación**

```typescript
// ✅ Controller limpio y enfocado
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const result = await this.authService.signIn(signInDto);
    return {
      success: true,
      message: 'Login successful',
      data: result,
    };
  }
}
```

### 2. **Service - Lógica de Negocio**

```typescript
// ✅ Service con toda la lógica
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    // Buscar usuario
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar contraseña
    const isPasswordValid = await this.comparePasswords(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar token
    const payload = { sub: user.id, email: user.email, name: user.name };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
```

### 3. **DTOs con Validaciones**

```typescript
// ✅ Validación automática con decoradores
export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
```

### 4. **Guards para Autenticación**

```typescript
// ✅ Guard especializado
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return super.canActivate(context);
  }
}
```

## 📋 Separación de Responsabilidades

### **Controller Layer**
- ✅ Manejo de rutas HTTP
- ✅ Validación de DTOs (automática)
- ✅ Transformación de respuestas
- ✅ Delegación a services
- ❌ Lógica de negocio
- ❌ Acceso directo a base de datos
- ❌ Validaciones manuales

### **Service Layer**
- ✅ Lógica de negocio
- ✅ Orquestación de operaciones
- ✅ Manejo de excepciones de negocio
- ✅ Transformación de datos
- ❌ Manejo de HTTP
- ❌ Validación de entrada

### **Repository/Entity Layer**
- ✅ Acceso a datos
- ✅ Consultas de base de datos
- ✅ Mapeo de entidades
- ❌ Lógica de negocio
- ❌ Validaciones complejas

## 🎯 Beneficios de la Refactorización

### **Testabilidad**
```typescript
// ✅ Fácil de testear
describe('AuthService', () => {
  it('should validate credentials and return token', async () => {
    const result = await authService.signIn(mockSignInDto);
    expect(result.token).toBeDefined();
  });
});
```

### **Reutilización**
```typescript
// ✅ Service reutilizable
export class AuthService {
  async signIn(signInDto: SignInDto) { /* ... */ }
  async refreshToken(token: string) { /* ... */ }
  async validateUser(userId: number) { /* ... */ }
}
```

### **Mantenibilidad**
- ✅ Código organizado por responsabilidades
- ✅ Fácil localización de bugs
- ✅ Cambios aislados por capa

### **Escalabilidad**
- ✅ Nuevas funcionalidades en la capa correcta
- ✅ Servicios independientes
- ✅ Inyección de dependencias clara

## 🚀 Convenciones de NestJS

1. **Controllers**: Solo HTTP endpoints
2. **Services**: Lógica de negocio con `@Injectable()`
3. **DTOs**: Validación con `class-validator`
4. **Guards**: Autenticación/Autorización
5. **Interceptors**: Transformación de respuestas
6. **Filters**: Manejo global de excepciones
7. **Pipes**: Validación y transformación

## 📖 Documentación Oficial
- [NestJS Architecture](https://docs.nestjs.com/first-steps)
- [Controllers](https://docs.nestjs.com/controllers)
- [Providers (Services)](https://docs.nestjs.com/providers)
- [Guards](https://docs.nestjs.com/guards)
- [Validation](https://docs.nestjs.com/techniques/validation)
