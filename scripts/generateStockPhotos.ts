/**
 * Gets some stock photos from picsum.photos and uploads them to
 * jerking.empornium.ph. Writes the URLs to src/stockPhotos.json.
 * 
 * We can't use picsum.photos directly in the userscript because its
 * CSP-blocked, but, obviously, jerking.empornium.ph isn't.
 * 
 * Run this script with `npm run gen-stock-photos`.
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const UPLOAD_COUNT = 20;

type UploadResponse = {
  image: {
    image: {
      url: string;
    };
  };
};

class JerkingUploadApi {
  private static readonly JERKING_HOME_PATH = 'https://jerking.empornium.ph/';
  private static readonly JERKING_UPLOAD_PATH = `${this.JERKING_HOME_PATH}json`;

  constructor(
    private authToken: string,
    private cookies: string[]
  ) {}

  static async create(): Promise<JerkingUploadApi> {
    const homeResponse = await axios.get(JerkingUploadApi.JERKING_HOME_PATH);

    const cookies = [...homeResponse.headers['set-cookie']!, 'AGREE_CONSENT=1; path=/'];
    const authToken = homeResponse.data.match(/PF.obj.config.auth_token = "([0-9a-f]+)";/)[1];

    return new JerkingUploadApi(authToken, cookies);
  }

  async upload(url: string): Promise<string> {
    const form = new FormData();
    form.append('source', url);
    form.append('type', 'url');
    form.append('auth_token', this.authToken);
    form.append('action', 'upload');

    const uploadResponse = await axios.post(JerkingUploadApi.JERKING_UPLOAD_PATH, form, {
      headers: {
        ...form.getHeaders(),
        Cookie: this.cookies
      }
    });

    if (uploadResponse.status !== 200) {
      throw new Error(`Failed to upload image: ${uploadResponse.status}`);
    }

    const data = uploadResponse.data as UploadResponse;

    return data.image.image.url;
  }

  async uploadStockPhoto(width: number = 160, height: number = 90): Promise<string> {
    const url = getPicsumImageUrl(width, height);
    return this.upload(url);
  }
}

function getPicsumImageUrl(width: number, height: number): string {
  const min = 1;
  const max = 1_000_000;
  const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  return `https://picsum.photos/${width}/${height}?random=${randomInt}`;
}

type StockPhotoBatch = string[];

function main() {
  JerkingUploadApi.create()
    .then((api) => {
      const uploadBatch = Array.from({ length: UPLOAD_COUNT }, () =>
        api
          .uploadStockPhoto()
          .then((url) => {
            console.log(url);
            return url;
          })
          .catch((error) => console.error(error))
      );
      return Promise.all(uploadBatch) as Promise<StockPhotoBatch>;
    })
    .then((urls) => {
      // Write the URLs to src/lib/stockPhotos.json
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const writePath = resolve(__dirname, '../src/stockPhotos.json');
      fs.writeFileSync(writePath, JSON.stringify(urls, null, 2));
      console.log(`Wrote ${urls.length} URLs to ${writePath}:`);
      console.log(urls);
    })
    .catch((error) => console.error(error));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
