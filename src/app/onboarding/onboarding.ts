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

interface Answer {
  id: string;
  value: string;
  label: string;
  image: string;
  weight: number;
  is_default: boolean;
  metadata: any;
}

export interface Question {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  question_type: string;
  order_index: string;
  document: string;
  image: string;
  weight: number;
  is_account: boolean;
  answers: Answer[];
  metadata: any;
}

export interface ClientResponse {
  id?: string;
  create_date?: Date;
  client_id: string;
  account_id?: string;
  answer_id?: string;
  answer_value?: string;
  metadata?: any;
}

export interface DecigionNode {
  id: string;
  create_date: Date;
  update_date: Date;
  name: string;
  question_id: string;
  is_first: boolean;
  metadata: any;
}

export interface NodeRelationship {
  id: string;
  create_date: Date;
  update_date: Date;
  node_parent_id: string;
  node_child_id: string;
  answer_id: string;
  value: string;
  is_leaf: boolean;
  decision_tree_id: string;
  metadata: any;
}
