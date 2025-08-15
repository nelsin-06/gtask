# Environment Variables Configuration

## Setup

This project uses `@nestjs/config` to manage environment variables globally across the application.

## Configuration Structure

### Files:
- `.env` - Environment variables file
- `src/config/configuration.ts` - Centralized configuration object

### Available Environment Variables:

```env
# Database Configuration
DB_HOST=your-database-host
DB_PORT=5432
DB_USER=your-username
DB_PASS=your-password
DB_NAME=your-database-name

# Application Configuration
PORT=3000
NODE_ENV=development
APP_NAME=Task Manager

# JWT Configuration (optional)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

## Usage Examples

### 1. In any Service:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YourService {
  constructor(private readonly configService: ConfigService) {}

  getConfig() {
    // Access individual environment variables
    const dbHost = this.configService.get<string>('DB_HOST');
    
    // Access nested configuration
    const dbHost2 = this.configService.get<string>('database.host');
    const appName = this.configService.get<string>('app.name');
    
    return { dbHost, dbHost2, appName };
  }
}
```

### 2. In any Controller:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('info')
  getAppInfo() {
    return {
      name: this.configService.get<string>('app.name'),
      environment: this.configService.get<string>('app.environment'),
      port: this.configService.get<number>('port'),
    };
  }
}
```

### 3. In any Module:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SomeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('API_KEY'),
        timeout: configService.get<number>('TIMEOUT'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class YourModule {}
```

## Key Benefits:

1. **Global Access**: ConfigService is available in any service/controller without importing ConfigModule
2. **Type Safety**: Uses TypeScript generics for type-safe configuration access
3. **Centralized**: All configuration logic is in one place
4. **Structured**: Nested configuration objects for better organization
5. **Environment Validation**: Can add validation schemas if needed

## Configuration Object Structure:

```typescript
{
  port: number,
  database: {
    host: string,
    port: number,
    username: string,
    password: string,
    name: string,
  },
  jwt: {
    secret: string,
    expiresIn: string,
  },
  app: {
    environment: string,
    name: string,
  }
}
```

## Access Patterns:

- Direct: `configService.get<string>('DB_HOST')`
- Nested: `configService.get<string>('database.host')`
- With default: `configService.get<string>('API_KEY', 'default-value')`
