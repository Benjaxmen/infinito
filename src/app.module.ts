import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import UserService from "./services/user.service";
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
