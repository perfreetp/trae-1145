import { create } from 'zustand';
import { DataProduct, Demand, IntentionOrder, Message, CommunicationRecord } from '@/types';
import { mockProducts } from '@/data/products';
import { mockDemands } from '@/data/demands';

const initialOrders: IntentionOrder[] = [
  {
    id: 'io1', productId: 'p1', productTitle: '全国企业工商注册数据集', type: 'supply', status: 'pending',
    createdAt: '2026-06-07', updatedAt: '2026-06-08', counterparty: '金信评估',
    quoteAmount: '¥50,000/年', lastMessage: '您好，我们对贵司的数据产品很感兴趣，请问可以提供样例数据吗？',
    communications: [
      { id: 'c1', sender: '金信评估', senderRole: 'demand', content: '您好，我们对贵司的数据产品很感兴趣，请问可以提供样例数据吗？', createdAt: '2026-06-07 10:30' },
    ]
  },
  {
    id: 'io2', productId: 'p2', productTitle: '城市交通流量实时数据', type: 'demand', status: 'negotiating',
    createdAt: '2026-06-05', updatedAt: '2026-06-08', counterparty: '智途科技',
    quoteAmount: '¥80,000/年', lastMessage: '价格方面我们可以再商量，能否提供按月订阅方案？',
    communications: [
      { id: 'c2', sender: '智途科技', senderRole: 'demand', content: '我们希望接入实时交通数据接口，延迟要求低于5秒', createdAt: '2026-06-05 14:20' },
      { id: 'c3', sender: '数据供方', senderRole: 'supply', content: '我们可以提供延迟2秒以内的API接口，覆盖一二线城市', createdAt: '2026-06-05 16:45' },
      { id: 'c4', sender: '智途科技', senderRole: 'demand', content: '价格方面我们可以再商量，能否提供按月订阅方案？', createdAt: '2026-06-08 09:10' },
    ]
  },
  {
    id: 'io3', productId: 'p4', productTitle: '电商用户行为分析数据集', type: 'supply', status: 'compliance',
    createdAt: '2026-06-02', updatedAt: '2026-06-07', counterparty: '商云网络',
    quoteAmount: '¥65,000/套', lastMessage: '合规材料已提交，请耐心等待审核结果。',
    communications: [
      { id: 'c5', sender: '商云网络', senderRole: 'demand', content: '希望了解数据脱敏的具体方式和合规保障', createdAt: '2026-06-02 11:00' },
      { id: 'c6', sender: '数据供方', senderRole: 'supply', content: '我们已通过等保三级认证，数据均经过k-匿名化处理', createdAt: '2026-06-03 09:30' },
      { id: 'c7', sender: '数据供方', senderRole: 'supply', content: '合规材料已提交，请耐心等待审核结果。', createdAt: '2026-06-07 14:20' },
    ]
  },
  {
    id: 'io4', productId: 'p5', productTitle: '气象环境监测数据服务', type: 'demand', status: 'confirmed',
    createdAt: '2026-05-28', updatedAt: '2026-06-04', counterparty: '农数科技',
    quoteAmount: '¥35,000/年', lastMessage: '交易已确认，数据交付安排中。',
    communications: [
      { id: 'c8', sender: '农数科技', senderRole: 'demand', content: '确认合作，期待数据交付', createdAt: '2026-06-04 10:00' },
    ]
  },
  {
    id: 'io5', productId: 'p6', productTitle: '金融信贷风险评估数据', type: 'supply', status: 'withdrawn',
    createdAt: '2026-05-20', updatedAt: '2026-05-25', counterparty: '银盾金科',
    quoteAmount: '¥200,000/年', lastMessage: '由于合规原因，本次交易已撤回。',
    communications: [
      { id: 'c9', sender: '银盾金科', senderRole: 'demand', content: '需要了解数据来源的合规性证明', createdAt: '2026-05-20 15:00' },
      { id: 'c10', sender: '数据供方', senderRole: 'supply', content: '由于合规原因，本次交易已撤回。', createdAt: '2026-05-25 09:00' },
    ]
  },
  {
    id: 'io6', productId: 'p7', productTitle: '物流运输轨迹数据集', type: 'demand', status: 'pending',
    createdAt: '2026-06-06', updatedAt: '2026-06-07', counterparty: '运链数据',
    quoteAmount: '¥120,000/年', lastMessage: '我们急需物流轨迹数据用于运输优化，请尽快回复。',
    communications: [
      { id: 'c11', sender: '运链数据', senderRole: 'demand', content: '我们急需物流轨迹数据用于运输优化，请尽快回复。', createdAt: '2026-06-06 08:45' },
    ]
  },
  {
    id: 'io7', productId: 'p3', productTitle: '医疗健康统计年鉴数据', type: 'supply', status: 'negotiating',
    createdAt: '2026-06-01', updatedAt: '2026-06-06', counterparty: '医数智能',
    quoteAmount: '¥150,000/套', lastMessage: '我们需要的标注数据量更大，能否定制？',
    communications: [
      { id: 'c12', sender: '医数智能', senderRole: 'demand', content: '数据集覆盖哪些病种？标注质量如何保证？', createdAt: '2026-06-01 13:20' },
      { id: 'c13', sender: '数据供方', senderRole: 'supply', content: '覆盖CT/MRI共12个病种，标注由三甲医院专家完成', createdAt: '2026-06-02 10:15' },
      { id: 'c14', sender: '医数智能', senderRole: 'demand', content: '我们需要的标注数据量更大，能否定制？', createdAt: '2026-06-06 11:30' },
    ]
  }
];

const initialMessages: Message[] = [
  { id: 'm1', title: '意向单已确认', content: '您对"全国企业工商注册数据集"的询价意向已被供方确认，请尽快完成合规材料提交。', type: 'transaction', read: false, createdAt: '2026-06-08 10:30', linkUrl: '/pages/intentionDetail/index?id=io1' },
  { id: 'm2', title: '交易进度更新', content: '订单"城市交通流量实时数据"已进入合规审核阶段，预计3个工作日内完成审核。', type: 'progress', read: false, createdAt: '2026-06-08 09:15', linkUrl: '/pages/progress/index?id=io2' },
  { id: 'm3', title: '新需求匹配提醒', content: '有3条新需求与您的数据产品匹配，请及时查看并响应。', type: 'system', read: false, createdAt: '2026-06-07 16:45', linkUrl: '' },
  { id: 'm4', title: '合规材料审核通过', content: '您提交的"金融信贷风险评估数据"合规材料已通过审核，可以进行下一步操作。', type: 'progress', read: true, createdAt: '2026-06-07 14:20', linkUrl: '/pages/progress/index?id=io5' },
  { id: 'm5', title: '收到新的询价', content: '金信评估对您的"全国企业工商注册数据集"发起了询价请求，请及时回复。', type: 'transaction', read: true, createdAt: '2026-06-06 11:30', linkUrl: '/pages/intentionDetail/index?id=io1' },
  { id: 'm6', title: '系统维护通知', content: '平台将于2026年6月10日凌晨2:00-4:00进行系统升级维护，届时部分功能暂不可用。', type: 'system', read: true, createdAt: '2026-06-05 18:00', linkUrl: '' },
  { id: 'm7', title: '交易完成确认', content: '订单"气象环境监测数据服务"已完成交付，请确认并评价。', type: 'transaction', read: true, createdAt: '2026-06-04 09:00', linkUrl: '/pages/progress/index?id=io4' },
  { id: 'm8', title: '风险提示', content: '您正在查看的"电商用户行为分析数据集"风险等级为高，请仔细阅读合规说明后再进行操作。', type: 'system', read: true, createdAt: '2026-06-03 15:30', linkUrl: '' }
];

interface AppState {
  products: DataProduct[];
  demands: Demand[];
  intentionOrders: IntentionOrder[];
  messages: Message[];
  addProduct: (product: DataProduct) => void;
  addDemand: (demand: Demand) => void;
  addIntentionOrder: (order: IntentionOrder) => void;
  updateOrderStatus: (orderId: string, status: IntentionOrder['status']) => void;
  addCommunication: (orderId: string, record: CommunicationRecord) => void;
  addMessage: (message: Message) => void;
  markMessageRead: (messageId: string) => void;
}

let msgIdCounter = 100;

export const useAppStore = create<AppState>((set) => ({
  products: [...mockProducts],
  demands: [...mockDemands],
  intentionOrders: [...initialOrders],
  messages: [...initialMessages],
  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
  addDemand: (demand) => set((state) => ({ demands: [demand, ...state.demands] })),
  addIntentionOrder: (order) => set((state) => ({ intentionOrders: [order, ...state.intentionOrders] })),
  updateOrderStatus: (orderId, status) => set((state) => ({
    intentionOrders: state.intentionOrders.map(o =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString().slice(0, 10) } : o
    )
  })),
  addCommunication: (orderId, record) => set((state) => ({
    intentionOrders: state.intentionOrders.map(o =>
      o.id === orderId
        ? { ...o, communications: [...o.communications, record], lastMessage: record.content, updatedAt: record.createdAt.slice(0, 10) }
        : o
    )
  })),
  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  markMessageRead: (messageId) => set((state) => ({
    messages: state.messages.map(m => m.id === messageId ? { ...m, read: true } : m)
  }))
}));
