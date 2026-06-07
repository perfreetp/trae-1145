import { create } from 'zustand';
import { DataProduct, Demand, IntentionOrder } from '@/types';
import { mockProducts } from '@/data/products';
import { mockDemands } from '@/data/demands';

const initialOrders: IntentionOrder[] = [
  { id: 'io1', productId: 'p1', productTitle: '全国企业工商注册数据集', type: 'supply', status: 'pending', createdAt: '2026-06-07', updatedAt: '2026-06-08', counterparty: '金信评估' },
  { id: 'io2', productId: 'p2', productTitle: '城市交通流量实时数据', type: 'demand', status: 'negotiating', createdAt: '2026-06-05', updatedAt: '2026-06-08', counterparty: '智途科技' },
  { id: 'io3', productId: 'p4', productTitle: '电商用户行为分析数据集', type: 'supply', status: 'compliance', createdAt: '2026-06-02', updatedAt: '2026-06-07', counterparty: '商云网络' },
  { id: 'io4', productId: 'p5', productTitle: '气象环境监测数据服务', type: 'demand', status: 'confirmed', createdAt: '2026-05-28', updatedAt: '2026-06-04', counterparty: '农数科技' },
  { id: 'io5', productId: 'p6', productTitle: '金融信贷风险评估数据', type: 'supply', status: 'withdrawn', createdAt: '2026-05-20', updatedAt: '2026-05-25', counterparty: '银盾金科' },
  { id: 'io6', productId: 'p7', productTitle: '物流运输轨迹数据集', type: 'demand', status: 'pending', createdAt: '2026-06-06', updatedAt: '2026-06-07', counterparty: '运链数据' },
  { id: 'io7', productId: 'p3', productTitle: '医疗健康统计年鉴数据', type: 'supply', status: 'negotiating', createdAt: '2026-06-01', updatedAt: '2026-06-06', counterparty: '医数智能' }
];

interface AppState {
  products: DataProduct[];
  demands: Demand[];
  intentionOrders: IntentionOrder[];
  addProduct: (product: DataProduct) => void;
  addDemand: (demand: Demand) => void;
  addIntentionOrder: (order: IntentionOrder) => void;
}

export const useAppStore = create<AppState>((set) => ({
  products: [...mockProducts],
  demands: [...mockDemands],
  intentionOrders: [...initialOrders],
  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
  addDemand: (demand) => set((state) => ({ demands: [demand, ...state.demands] })),
  addIntentionOrder: (order) => set((state) => ({ intentionOrders: [order, ...state.intentionOrders] })),
}));
