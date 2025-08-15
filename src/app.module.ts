import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      load: [configuration], // Load our configuration file
      envFilePath: '.env', // Path to your .env file
    }),
    DatabaseModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
