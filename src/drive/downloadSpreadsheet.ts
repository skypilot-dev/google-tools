/* eslint-disable no-console */

import fs from 'fs';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { GaxiosResponse } from 'gaxios';
import { Credentials } from 'src/auth/_types';
import { createAuthClient } from 'src/auth/createAuthClient';

interface SpreadsheetDownloadOptions {
  code?: string;
  googleDriveFileId: string;
  targetFilepath: string;
}

export async function downloadSpreadsheet(
  client: JWT, downloadOptions: SpreadsheetDownloadOptions,
): Promise<void> {
  /* FIXME: Fix method call. The call works, but doesn't match the method signature. */
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const drive = google.drive({ version: 'v3', client });
  const { googleDriveFileId, targetFilepath } = downloadOptions;
  const streamTarget = fs.createWriteStream(targetFilepath);
  return drive.files.export({
    auth: client,
    fileId: googleDriveFileId,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }, { responseType: 'stream' })
    .then((response: GaxiosResponse) => {
      response.data
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .on('error', (error: any) => {
          throw new Error(`Stream error: ${error.message}`);
        })
        .pipe(streamTarget);
    })
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    .catch((error: any) => {
      const { statusText } = error.response;
      return Promise.reject(new Error(`Error: ${statusText}`));
    });
}

export async function downloadSpreadsheets(
  downloadOptions: SpreadsheetDownloadOptions[],
  credentials: Credentials,
): Promise<void> {
  const authClient = await createAuthClient(credentials);
  const downloadPromises = downloadOptions
    .map((options) => (
      downloadSpreadsheet(authClient, options)
        .then(() => console.log(`Download complete: ${options.targetFilepath}`))
        .catch((error) => console.error(`Download FAILED: ${options.targetFilepath}: ${error.message}`))
    ));

  await Promise.all(downloadPromises);
}
