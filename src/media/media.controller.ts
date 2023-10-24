import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Res,
    ServiceUnavailableException,
    UploadedFile,
    UseInterceptors,
  } from "@nestjs/common";
  import { FileInterceptor } from "@nestjs/platform-express";
  import { Response } from "express";
  import { StorageFile } from "src/storage/storage-file";
  import { StorageService } from "src/storage/storage.service";
  import UserService from "src/services/user.service";
  
  
  @Controller("media")
  export class MediaController {
    constructor(private storageService: StorageService, private userService: UserService) {}
  
    @Post()
    @UseInterceptors(
      FileInterceptor("file", {
        limits: {
          files: 1,
        },
      })
    )
    async uploadMedia(
      @UploadedFile() file: Express.Multer.File,
      @Body("userId") userId: string
    ) {
      const mediaId= await this.userService.add_media(userId)
      await this.storageService.save(
        "media/" + mediaId,
        file.mimetype,
        file.buffer,
        [{ mediaId: mediaId }]
      );
      return mediaId
    }
  
    @Get(":mediaId")
    async downloadMedia(@Param("mediaId") mediaId: string, @Res() res: Response) {
      let storageFile: StorageFile; 
      try {
        storageFile = await this.storageService.get("media/" + mediaId);
      } catch (e) {
        if (e.message.toString().includes("No such object")) {
          throw new NotFoundException("image not found");
        } else {
          throw new ServiceUnavailableException("internal error");
        }
      }
      res.setHeader("contentType", storageFile.contentType);
      res.setHeader("Cache-Control", "max-age=60d");
      res.end(storageFile.buffer);
    }
  }