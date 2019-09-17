interface Client {
  client_id: string;
  client_account_association_type: string;
}

interface Goal {
  goal_id: string;
  goal_amount: number;
  accumulation_horizon: number;
}

export interface AccountType {
  id: string;
  create_date: Date;
  update_date: Date;
  managed: boolean;
  name: string;
  account_type_id: string;
  clients: Client[];
  goals: Goal[];
  metadata: any;
}
