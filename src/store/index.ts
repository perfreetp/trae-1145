import { create } from 'zustand';
import { DataProduct, Demand, IntentionOrder, Message, CommunicationRecord, ComplianceMaterialItem } from '@/types';
import { mockProducts } from '@/data/products';
import { mockDemands } from '@/data/demands';

const defaultMaterials: ComplianceMaterialItem[] = [
  { label: '数据来源合规证明', status: 'missing' },
  { label: '数据脱敏处理报告', status: 'missing' },
  { label: '安全评估报告', status: 'missing' },
  { label: '数据交易协议模板', status: 'missing' },
  { label: '个人信息保护影响评估', status: 'missing' }
];

const io3Materials: ComplianceMaterialItem[] = [
  { label: '数据来源合规证明', status: 'done' },
  { label: '数据脱敏处理报告', status: 'done' },
  { label: '安全评估报告', status: 'pending' },
  { label: '数据交易协议模板', status: 'missing' },
  { label: '个人信息保护影响评估', status: 'missing' }
];

const initialOrders: IntentionOrder[] = [
  {
    id: 'io1', productId: 'p1', productTitle: '全国企业工商注册数据集', demandId: '', demandTitle: '', type: 'supply', status: 'pending',
    createdAt: '2026-06-07', updatedAt: '2026-06-08', counterparty: '金信评估',
    quoteAmount: '¥50,000/年', quoteModified: false, lastMessage: '您好，我们对贵司的数据产品很感兴趣，请问可以提供样例数据吗？',
    complianceMaterials: [...defaultMaterials], complianceSubmitted: false,
    communications: [
      { id: 'c1', sender: '金信评估', senderRole: 'demand', type: 'inquiry', content: '您好，我们对贵司的数据产品很感兴趣，请问可以提供样例数据吗？', createdAt: '2026-06-07 10:30' },
    ]
  },
  {
    id: 'io2', productId: 'p2', productTitle: '城市交通流量实时数据', demandId: 'd2', demandTitle: '求购城市交通实时数据接口', type: 'demand', status: 'negotiating',
    createdAt: '2026-06-05', updatedAt: '2026-06-08', counterparty: '智途科技',
    quoteAmount: '¥80,000/年', quoteModified: false, lastMessage: '价格方面我们可以再商量，能否提供按月订阅方案？',
    supplyInfo: { contactName: '数据供方', phone: '010-12345678', deliveryCycle: '签订合同后7个工作日', dataDesc: '可提供延迟2秒以内的API接口，覆盖一二线城市' },
    complianceMaterials: [...defaultMaterials], complianceSubmitted: false,
    communications: [
      { id: 'c2', sender: '智途科技', senderRole: 'demand', type: 'inquiry', content: '我们希望接入实时交通数据接口，延迟要求低于5秒', createdAt: '2026-06-05 14:20' },
      { id: 'c3', sender: '数据供方', senderRole: 'supply', type: 'quote', content: '报价：¥80,000/年，可提供延迟2秒以内的API接口，覆盖一二线城市', createdAt: '2026-06-05 16:45' },
      { id: 'c4', sender: '智途科技', senderRole: 'demand', type: 'message', content: '价格方面我们可以再商量，能否提供按月订阅方案？', createdAt: '2026-06-08 09:10' },
    ]
  },
  {
    id: 'io3', productId: 'p4', productTitle: '电商用户行为分析数据集', demandId: '', demandTitle: '', type: 'supply', status: 'compliance',
    createdAt: '2026-06-02', updatedAt: '2026-06-07', counterparty: '商云网络',
    quoteAmount: '¥65,000/套', quoteModified: false, lastMessage: '合规材料已提交，请耐心等待审核结果。',
    complianceMaterials: [...io3Materials], complianceSubmitted: true,
    communications: [
      { id: 'c5', sender: '商云网络', senderRole: 'demand', type: 'inquiry', content: '希望了解数据脱敏的具体方式和合规保障', createdAt: '2026-06-02 11:00' },
      { id: 'c6', sender: '数据供方', senderRole: 'supply', type: 'message', content: '我们已通过等保三级认证，数据均经过k-匿名化处理', createdAt: '2026-06-03 09:30' },
      { id: 'c7', sender: '数据供方', senderRole: 'supply', type: 'status', content: '合规材料已提交，请耐心等待审核结果。', createdAt: '2026-06-07 14:20' },
    ]
  },
  {
    id: 'io4', productId: 'p5', productTitle: '气象环境监测数据服务', demandId: 'd9', demandTitle: '农业气象精准预报数据', type: 'demand', status: 'completed',
    createdAt: '2026-05-28', updatedAt: '2026-06-04', counterparty: '农数科技',
    quoteAmount: '¥35,000/年', quoteModified: false, lastMessage: '交易已完成，数据已验收。',
    supplyInfo: { contactName: '气象数据供方', phone: '0931-87654321', deliveryCycle: '签订合同后5个工作日', dataDesc: '精准到县级的气象预报API接口' },
    complianceMaterials: defaultMaterials.map(m => ({ ...m, status: 'done' })), complianceSubmitted: true,
    delivery: { method: 'API接口', deliveryTime: '2026-06-01', acceptanceStatus: 'accepted', acceptanceTime: '2026-06-03' },
    communications: [
      { id: 'c8', sender: '农数科技', senderRole: 'demand', type: 'status', content: '确认合作，期待数据交付', createdAt: '2026-06-04 10:00' },
    ]
  },
  {
    id: 'io5', productId: 'p6', productTitle: '金融信贷风险评估数据', demandId: '', demandTitle: '', type: 'supply', status: 'withdrawn',
    createdAt: '2026-05-20', updatedAt: '2026-05-25', counterparty: '银盾金科',
    quoteAmount: '¥200,000/年', quoteModified: false, lastMessage: '由于合规原因，本次交易已撤回。',
    complianceMaterials: [...defaultMaterials], complianceSubmitted: false,
    communications: [
      { id: 'c9', sender: '银盾金科', senderRole: 'demand', type: 'inquiry', content: '需要了解数据来源的合规性证明', createdAt: '2026-05-20 15:00' },
      { id: 'c10', sender: '数据供方', senderRole: 'supply', type: 'status', content: '由于合规原因，本次交易已撤回。', createdAt: '2026-05-25 09:00' },
    ]
  },
  {
    id: 'io6', productId: 'p7', productTitle: '物流运输轨迹数据集', demandId: '', demandTitle: '', type: 'demand', status: 'pending',
    createdAt: '2026-06-06', updatedAt: '2026-06-07', counterparty: '运链数据',
    quoteAmount: '¥120,000/年', quoteModified: false, lastMessage: '我们急需物流轨迹数据用于运输优化，请尽快回复。',
    complianceMaterials: [...defaultMaterials], complianceSubmitted: false,
    communications: [
      { id: 'c11', sender: '运链数据', senderRole: 'demand', type: 'inquiry', content: '我们急需物流轨迹数据用于运输优化，请尽快回复。', createdAt: '2026-06-06 08:45' },
    ]
  },
  {
    id: 'io7', productId: 'p3', productTitle: '医疗健康统计年鉴数据', demandId: '', demandTitle: '', type: 'supply', status: 'negotiating',
    createdAt: '2026-06-01', updatedAt: '2026-06-06', counterparty: '医数智能',
    quoteAmount: '¥150,000/套', quoteModified: false, lastMessage: '我们需要的标注数据量更大，能否定制？',
    complianceMaterials: [...defaultMaterials], complianceSubmitted: false,
    communications: [
      { id: 'c12', sender: '医数智能', senderRole: 'demand', type: 'inquiry', content: '数据集覆盖哪些病种？标注质量如何保证？', createdAt: '2026-06-01 13:20' },
      { id: 'c13', sender: '数据供方', senderRole: 'supply', type: 'quote', content: '报价：¥150,000/套，覆盖CT/MRI共12个病种，标注由三甲医院专家完成', createdAt: '2026-06-02 10:15' },
      { id: 'c14', sender: '医数智能', senderRole: 'demand', type: 'message', content: '我们需要的标注数据量更大，能否定制？', createdAt: '2026-06-06 11:30' },
    ]
  }
];

const initialMessages: Message[] = [
  { id: 'm1', title: '意向单已确认', content: '您对"全国企业工商注册数据集"的询价意向已被供方确认，请尽快完成合规材料提交。', type: 'transaction', subtype: 'status', read: false, createdAt: '2026-06-08 10:30', linkUrl: '/pages/intentionDetail/index?id=io1', orderId: 'io1' },
  { id: 'm2', title: '交易进度更新', content: '订单"城市交通流量实时数据"已进入合规审核阶段，预计3个工作日内完成审核。', type: 'progress', subtype: 'status', read: false, createdAt: '2026-06-08 09:15', linkUrl: '/pages/progress/index?id=io2', orderId: 'io2' },
  { id: 'm3', title: '新需求匹配提醒', content: '有3条新需求与您的数据产品匹配，请及时查看并响应。', type: 'system', subtype: 'system', read: false, createdAt: '2026-06-07 16:45', linkUrl: '', orderId: '' },
  { id: 'm4', title: '合规材料审核通过', content: '您提交的"金融信贷风险评估数据"合规材料已通过审核，可以进行下一步操作。', type: 'progress', subtype: 'compliance', read: true, createdAt: '2026-06-07 14:20', linkUrl: '/pages/intentionDetail/index?id=io5', orderId: 'io5' },
  { id: 'm5', title: '收到新的询价', content: '金信评估对您的"全国企业工商注册数据集"发起了询价请求，请及时回复。', type: 'transaction', subtype: 'status', read: true, createdAt: '2026-06-06 11:30', linkUrl: '/pages/intentionDetail/index?id=io1', orderId: 'io1' },
  { id: 'm6', title: '系统维护通知', content: '平台将于2026年6月10日凌晨2:00-4:00进行系统升级维护，届时部分功能暂不可用。', type: 'system', subtype: 'system', read: true, createdAt: '2026-06-05 18:00', linkUrl: '', orderId: '' },
  { id: 'm7', title: '交易完成确认', content: '订单"气象环境监测数据服务"已完成交付，请确认并评价。', type: 'transaction', subtype: 'delivery', read: true, createdAt: '2026-06-04 09:00', linkUrl: '/pages/intentionDetail/index?id=io4', orderId: 'io4' },
  { id: 'm8', title: '风险提示', content: '您正在查看的"电商用户行为分析数据集"风险等级为高，请仔细阅读合规说明后再进行操作。', type: 'system', subtype: 'system', read: true, createdAt: '2026-06-03 15:30', linkUrl: '', orderId: '' }
];

interface AppState {
  products: DataProduct[];
  demands: Demand[];
  intentionOrders: IntentionOrder[];
  messages: Message[];
  addProduct: (product: DataProduct) => void;
  addDemand: (demand: Demand) => void;
  addIntentionOrder: (order: IntentionOrder) => void;
  updateOrderStatus: (orderId: string, status: IntentionOrder['status'], statusMsg?: string) => void;
  addCommunication: (orderId: string, record: CommunicationRecord) => void;
  updateQuote: (orderId: string, newQuote: string, record: CommunicationRecord) => void;
  uploadComplianceMaterial: (orderId: string, index: number) => void;
  submitCompliance: (orderId: string) => void;
  updateDelivery: (orderId: string, delivery: import('@/types').DeliveryInfo) => void;
  addMessage: (message: Message) => void;
  markMessageRead: (messageId: string) => void;
  markMessagesReadByOrder: (orderId: string) => void;
}

const nowStr = () => {
  const now = new Date();
  return `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const useAppStore = create<AppState>((set) => ({
  products: [...mockProducts],
  demands: [...mockDemands],
  intentionOrders: [...initialOrders],
  messages: [...initialMessages],
  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
  addDemand: (demand) => set((state) => ({ demands: [demand, ...state.demands] })),
  addIntentionOrder: (order) => set((state) => ({ intentionOrders: [order, ...state.intentionOrders] })),
  updateOrderStatus: (orderId, status, statusMsg) => set((state) => {
    const msg = statusMsg || (status === 'confirmed' ? '交易已确认' : status === 'withdrawn' ? '交易已撤回' : status === 'delivering' ? '数据交付中' : status === 'completed' ? '交易已完成' : '');
    const today = new Date().toISOString().slice(0, 10);
    return {
      intentionOrders: state.intentionOrders.map(o =>
        o.id === orderId ? {
          ...o, status, updatedAt: today, lastMessage: msg,
          communications: [...o.communications, { id: `comm_s_${Date.now()}`, sender: '系统', senderRole: 'supply' as const, type: 'status' as const, content: msg, createdAt: nowStr() }]
        } : o
      )
    };
  }),
  addCommunication: (orderId, record) => set((state) => ({
    intentionOrders: state.intentionOrders.map(o =>
      o.id === orderId
        ? { ...o, communications: [...o.communications, record], lastMessage: record.content, updatedAt: record.createdAt.slice(0, 10) }
        : o
    )
  })),
  updateQuote: (orderId, newQuote, record) => set((state) => ({
    intentionOrders: state.intentionOrders.map(o =>
      o.id === orderId
        ? { ...o, quoteAmount: newQuote, quoteModified: true, communications: [...o.communications, record], lastMessage: record.content, updatedAt: record.createdAt.slice(0, 10) }
        : o
    )
  })),
  uploadComplianceMaterial: (orderId, index) => set((state) => ({
    intentionOrders: state.intentionOrders.map(o =>
      o.id === orderId
        ? { ...o, complianceMaterials: o.complianceMaterials.map((m, i) => i === index ? { ...m, status: 'done' } : m) }
        : o
    )
  })),
  submitCompliance: (orderId) => set((state) => ({
    intentionOrders: state.intentionOrders.map(o =>
      o.id === orderId
        ? { ...o, complianceSubmitted: true, status: 'compliance', updatedAt: new Date().toISOString().slice(0, 10), lastMessage: '合规材料已提交审核',
            complianceMaterials: o.complianceMaterials.map(m => ({ ...m, status: m.status === 'done' ? 'pending' as const : m.status })),
            communications: [...o.communications, { id: `comm_c_${Date.now()}`, sender: '系统', senderRole: 'supply' as const, type: 'status' as const, content: '合规材料已提交审核', createdAt: nowStr() }]
          }
        : o
    )
  })),
  updateDelivery: (orderId, delivery) => set((state) => ({
    intentionOrders: state.intentionOrders.map(o =>
      o.id === orderId
        ? { ...o, delivery, updatedAt: new Date().toISOString().slice(0, 10) }
        : o
    )
  })),
  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  markMessageRead: (messageId) => set((state) => ({
    messages: state.messages.map(m => m.id === messageId ? { ...m, read: true } : m)
  })),
  markMessagesReadByOrder: (orderId) => set((state) => ({
    messages: state.messages.map(m => m.orderId === orderId ? { ...m, read: true } : m)
  }))
}));
