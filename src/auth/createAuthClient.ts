import { CredentialBody, GoogleAuth, JWT } from 'google-auth-library';


const GOOGLE_AUTH_SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

export async function createAuthClient(credentials: CredentialBody): Promise<JWT> {
  /* When run locally, this always returns a JWT client */
  const auth = new GoogleAuth({
    credentials,
    scopes: GOOGLE_AUTH_SCOPES,
  });
  const client = await auth.getClient() as JWT;
  let token;
  try {
    token = await client.authorize();
  } catch (error) {
    throw new Error(`Could not get OAuth token: ${error.message}`);
  }
  client.setCredentials(token);
  return client;
}
