import {
    Body,
    Controller,
    Get,
    Delete,
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
@Controller("doc")
export class DocController {
  constructor(private storageService: StorageService, private userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        files: 1,
      },
    })
  )
  async uploadDoc(
    @UploadedFile() file: Express.Multer.File,
    @Body("userId") userId: string
  ) {
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
    const user = await this.userService.findOnebyId(userId)
    const docId=  user.doc
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
