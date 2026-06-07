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
  demanderPhone: string;
  publishDate: string;
  deadline: string;
  responseCount: number;
  status: 'open' | 'in_progress' | 'closed';
}

export interface CommunicationRecord {
  id: string;
  sender: string;
  senderRole: 'supply' | 'demand';
  type: 'inquiry' | 'message' | 'quote' | 'status';
  content: string;
  createdAt: string;
}

export interface InquiryInfo {
  company: string;
  contactName: string;
  phone: string;
  purpose: string;
  remark: string;
  expectedBudget: string;
  expectedDelivery: string;
}

export interface SupplyInfo {
  contactName: string;
  phone: string;
  deliveryCycle: string;
  dataDesc: string;
}

export interface ComplianceMaterialItem {
  label: string;
  status: 'done' | 'pending' | 'missing';
}

export interface DeliveryInfo {
  method: string;
  deliveryTime: string;
  acceptanceStatus: 'pending' | 'accepted' | 'rejected';
  acceptanceTime: string;
}

export interface IntentionOrder {
  id: string;
  productId: string;
  productTitle: string;
  demandId: string;
  demandTitle: string;
  type: 'supply' | 'demand';
  status: 'pending' | 'negotiating' | 'compliance' | 'confirmed' | 'delivering' | 'completed' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
  counterparty: string;
  quoteAmount: string;
  quoteModified: boolean;
  lastMessage: string;
  communications: CommunicationRecord[];
  inquiryInfo?: InquiryInfo;
  supplyInfo?: SupplyInfo;
  complianceMaterials: ComplianceMaterialItem[];
  complianceSubmitted: boolean;
  delivery?: DeliveryInfo;
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
  subtype: 'quote' | 'message' | 'compliance' | 'delivery' | 'status' | 'system';
  read: boolean;
  createdAt: string;
  linkUrl: string;
  orderId: string;
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
