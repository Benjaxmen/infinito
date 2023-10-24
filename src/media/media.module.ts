import { Module } from "@nestjs/common";
import { StorageModule } from "src/storage/storage.module";
import { MediaController } from "./media.controller";
import UserService from "src/services/user.service";

@Module({
  imports: [StorageModule],
  controllers: [MediaController],
  providers: [UserService]
})
export class MediaModule {}