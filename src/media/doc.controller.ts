import {
    Body,
    Controller,
    Get,
    Delete,
    NotFoundException,BadRequestException,
    Param,
    Post,
    Res,
    Put,
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
import { NotFoundError } from "rxjs";
  
@Controller("doc")
export class DocController {
  constructor(private storageService: StorageService, private userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        files: 1
      },
    })
  )
  async uploadDoc(
    @UploadedFile() file: Express.Multer.File,
    @Body("userId") userId: string
  ) {
    const user = await this.userService.findOnebyId(userId)
    if(user.doc){
      await this.storageService.delete("docs/"+user.doc)
    }
    const docId = await this.userService.add_doc(userId);
    await this.storageService.save(
      "docs/" + docId,
      file.mimetype,
      file.buffer,
      [{ docId: docId }]
    );
    return docId;
  }
  @Get("/user/:userId")
  async downloadUserDoc(@Param("userId") userId: string, @Res() res: Response){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user = await this.userService.findOnebyId(userId)
    if (!user){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no válido' })
    }
    const docId=  user.doc
    if (!user.doc){
      let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.get("docs/" + "123123123");
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
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.get("docs/" + docId);
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
  @Post("/user/:userId")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        files: 1,
      },
    })
  )
  async updateUserDoc(@UploadedFile() file: Express.Multer.File,@Param("userId") userId: string, @Res() res: Response){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }

    const user = await this.userService.findOnebyId(userId)
    if (!user){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no válido' })
    }
    const docId=  user.doc

    if (user.doc){
      await this.storageService.delete("docs/"+docId)
    }
    
    return await this.uploadDoc(file, userId)
    

  }



  @Get(":docId")
  async downloadDoc(@Param("docId") docId: string, @Res() res: Response) {
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.get("docs/" + docId);
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
  async deleteUserDoc(@Param("userId") userId: string){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user = await this.userService.findOnebyId(userId)
    if (!user){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no válido' })
    }
    const docId=  user.doc
    if (!user.doc){
      throw new NotFoundException("document not found")
    }
    await this.userService.update(user._id,{doc: null})
    return await this.storageService.delete("docs/"+docId);

  }

  @Delete(":docId")
  async deleteDoc(@Param("docId") docId: string, @Res() res: Response) {
    try {
      return await this.storageService.delete("docs/" + docId);
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("document not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }
  }
}
