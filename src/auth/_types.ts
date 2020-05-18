import { Email } from '@skypilot/common-types';

export interface Credentials {
  auth_uri: string;
  auth_provider_x509_cert_url: string;
  client_email: Email;
  client_id: string;
  client_x509_cert_url: string;
  private_key_id: string;
  project_id: string;
  token_uri: string;
  type: string;
}
