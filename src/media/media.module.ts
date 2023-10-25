import { Module } from "@nestjs/common";
import { StorageModule } from "src/storage/storage.module";
import { MediaController } from "./media.controller";
import UserService from "src/services/user.service";
import { DocController } from "./doc.controller";

@Module({
  imports: [StorageModule],
  controllers: [MediaController,DocController],
  providers: [UserService]
})
export class MediaModule {}