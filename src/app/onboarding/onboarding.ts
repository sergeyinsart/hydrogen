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

export interface Answer {
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

export interface Allocation {
  id: string;
  create_date: Date;
  update_date: Date;
  category: string;
  description: string;
  is_active: boolean;
  name: string;
  volatility: number;
  performance: number;
  node_map: {node_id: string};
  metadata: any;
}

export interface ModelHolding {
  id: string;
  create_date: Date;
  update_date: Date;
  current_weight: number;
  strategic_weight: number;
  date: string;
  model_id: string;
  security_id: string;
  metadata: any;
}

export interface SecurityCountry {
  weight: number;
  country: string;
}

interface SecurityComposition {
  component_id: string;
  start_date: string;
  end_date: string;
  weight: number;
}

export interface Securitie {
  id: string;
  create_date: Date;
  update_date: Date;
  is_active: boolean;
  name: string;
  security_class: string;
  ticker: string;
  proxy_id: string;
  metadata: any;
  security_country: SecurityCountry[];
  security_composition: SecurityComposition[];
  asset_class: string;
}

export interface PortfolioRecommendation {
  id: string;
  create_date: Date;
  update_date: Date;
  description: string;
  name: string;
  percentage: number;
  account_id: string;
  model_id: string;
  metadata: any;
}
