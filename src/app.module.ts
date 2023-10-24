import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import UserService from "./services/user.service";
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { MediaModule } from './media/media.module';
import CurriculumService from './services/curriculum.service';


@Module({
  imports: [ConfigModule.forRoot(), AuthModule, StorageModule, MediaModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService,CurriculumService],
})
export class AppModule {}
