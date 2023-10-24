import { StorageFile } from "./storage-file";
import { DownloadResponse, Storage } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import StorageConfig from "./storage-config";


@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });

    this.bucket = StorageConfig.mediaBucket;
  }

  async save(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: any }[]
  ) {
    const file = this.storage.bucket(this.bucket).file(path);
    const stream = file.createWriteStream();
  
    stream.on("finish", async () => {
      // Configurar metadatos
      const fileMetadata = {
        contentType: contentType,
        mediaId: metadata
      };
  
      return await file.setMetadata(fileMetadata);
    });
  
    stream.end(media);
  }
  
  

  async delete(path: string) {
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ ignoreNotFound: true });
  }

  async get(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;
  
    // Obtener los metadatos del archivo
    const [metadata] = await this.storage.bucket(this.bucket).file(path).getMetadata();
  
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
  
    // Crear un nuevo objeto Map con tipos específicos
    storageFile.metadata = new Map<string, string>(Object.entries(metadata || {}) as [string, string][]);
  
    // Establecer el tipo de contenido desde los metadatos
    storageFile.contentType = storageFile.metadata.get("contentType");
  
    return storageFile;
  }
  
  

  async getWithMetaData(path: string): Promise<StorageFile> {
    const [bucketObj] = await this.storage.bucket(this.bucket).file(path).getMetadata();
    const {metadata} = bucketObj;
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;

    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>(
      Object.entries( metadata||{})
    );
    storageFile.contentType = storageFile.metadata.get("contentType");
    return storageFile;
  }
}