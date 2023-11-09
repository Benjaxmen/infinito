import {
    Body,
    Controller,
    Get,
    Put,
    Delete,
    NotFoundException,BadRequestException,
    Param,
    Post,
    Res,
    ServiceUnavailableException,
    UploadedFile,
    UseInterceptors,
  } from "@nestjs/common";
    import * as mongoose from 'mongoose';
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
    @Get("/user/:userId")
  async downloadUserMedia(@Param("userId") userId: string, @Res() res: Response){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user = await this.userService.findOnebyId(userId)
    if (!user){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no válido' })
    }
    const mediaId=  user.media
    if (!user.media){
      throw new NotFoundException("document not found")
    }
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.get("media/" + mediaId);
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("document not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }
    res.setHeader("Content-Type", storageFile.contentType);
    res.setHeader("Cache-Control", "max-age=60d");
    res.end(storageFile.buffer);

  }
  @Delete("/user/:userId")
  async deleteUserMedia(@Param("userId") userId: string){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user = await this.userService.findOnebyId(userId)
    if (!user){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no válido' })
    }
    const mediaId=  user.media
    if (!user.media){
      throw new NotFoundException("document not found")
    }
    return await this.storageService.delete("media/"+mediaId);

  }
  @Put("/user/:userId")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        files: 1,
      },
    })
  )
  async updateUserMedia(@UploadedFile() file: Express.Multer.File,@Param("userId") userId: string, @Res() res: Response){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user = await this.userService.findOnebyId(userId)
    if (!user){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no válido' })
    }
    const mediaId=  user.media
    if (!user.media){
      throw new NotFoundException("document not found")
    }
    await this.storageService.delete("media/"+mediaId)
    return await this.uploadMedia(file, userId)
    

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
    @Delete(":mediaId")
    async deleteMedia(@Param("mediaId") mediaId: string, @Res() res: Response) {
      try {
        return await this.storageService.delete("media/" + mediaId);
      } catch (e) {
        if (e.message.toString().includes("No such object")) {
          throw new NotFoundException("image not found");
        } else {
          throw new ServiceUnavailableException("internal error");
        }
      }
    }
    
  }