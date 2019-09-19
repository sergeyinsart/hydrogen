// tslint:disable:variable-name
interface Address {
  address_line1: string;
  address_line2: string;
  city: string;
  type: string;
  postalcode: string;
  country: string;
  state: string;
}

export class User {
  email = '';
  username = '';
  client_type = 'individual';
  first_name = '';
  last_name = '';
  phone_number = '';
  address: Address[];
  id: string;
  token?: string;
  constructor() {}
}

export class UserCredentialsConfig {
  username: string;
  password: string;
  is_account_non_expired = true;
  is_account_non_locked = true;
  is_credentials_non_expired = true;
  is_enabled = true;
  authorities = 'ROLE_CLIENT';

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export interface Account {
  id: string;
  create_date: Date;
  update_date: Date;
  managed: boolean;
  name: string;
  account_type_id: string;
  clients: {
    client_id: string;
    client_account_association_type: string;
  };
  goals: any;
  metadata: any;
}
