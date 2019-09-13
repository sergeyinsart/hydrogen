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
  client_type = '';
  first_name = '';
  last_name = '';
  phone_number = '';
  address: Address[];
  constructor() {}
}
