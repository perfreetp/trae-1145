export interface DataProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: string;
  priceUnit: string;
  provider: string;
  providerAvatar: string;
  coverImage: string;
  updateDate: string;
  viewCount: number;
  collectCount: number;
  sampleAvailable: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Demand {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  budget: string;
  budgetUnit: string;
  demander: string;
  demanderAvatar: string;
  publishDate: string;
  deadline: string;
  responseCount: number;
  status: 'open' | 'in_progress' | 'closed';
}

export interface IntentionOrder {
  id: string;
  productId: string;
  productTitle: string;
  type: 'supply' | 'demand';
  status: 'pending' | 'negotiating' | 'compliance' | 'confirmed' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
  counterparty: string;
}

export interface TransactionProgress {
  id: string;
  orderTitle: string;
  currentNode: number;
  nodes: ProgressNode[];
  status: 'active' | 'completed' | 'withdrawn';
}

export interface ProgressNode {
  title: string;
  description: string;
  completed: boolean;
  date?: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'transaction' | 'progress';
  read: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string;
  phone: string;
}

export interface Evaluation {
  id: string;
  targetName: string;
  rating: number;
  content: string;
  createdAt: string;
  author: string;
}

export interface HistoryCooperation {
  id: string;
  title: string;
  partner: string;
  date: string;
  amount: string;
  status: 'completed';
}
