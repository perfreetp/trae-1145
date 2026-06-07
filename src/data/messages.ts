import { Message } from '@/types'

export const mockMessages: Message[] = [
  {
    id: 'm1',
    title: '意向单已确认',
    content: '您对"全国企业工商注册数据集"的询价意向已被供方确认，请尽快完成合规材料提交。',
    type: 'transaction',
    read: false,
    createdAt: '2026-06-08 10:30'
  },
  {
    id: 'm2',
    title: '交易进度更新',
    content: '订单"城市交通流量实时数据"已进入合规审核阶段，预计3个工作日内完成审核。',
    type: 'progress',
    read: false,
    createdAt: '2026-06-08 09:15'
  },
  {
    id: 'm3',
    title: '新需求匹配提醒',
    content: '有3条新需求与您的数据产品匹配，请及时查看并响应。',
    type: 'system',
    read: false,
    createdAt: '2026-06-07 16:45'
  },
  {
    id: 'm4',
    title: '合规材料审核通过',
    content: '您提交的"金融信贷风险评估数据"合规材料已通过审核，可以进行下一步操作。',
    type: 'progress',
    read: true,
    createdAt: '2026-06-07 14:20'
  },
  {
    id: 'm5',
    title: '收到新的询价',
    content: '金信评估对您的"全国企业工商注册数据集"发起了询价请求，请及时回复。',
    type: 'transaction',
    read: true,
    createdAt: '2026-06-06 11:30'
  },
  {
    id: 'm6',
    title: '系统维护通知',
    content: '平台将于2026年6月10日凌晨2:00-4:00进行系统升级维护，届时部分功能暂不可用。',
    type: 'system',
    read: true,
    createdAt: '2026-06-05 18:00'
  },
  {
    id: 'm7',
    title: '交易完成确认',
    content: '订单"气象环境监测数据服务"已完成交付，请确认并评价。',
    type: 'transaction',
    read: true,
    createdAt: '2026-06-04 09:00'
  },
  {
    id: 'm8',
    title: '风险提示',
    content: '您正在查看的"电商用户行为分析数据集"风险等级为高，请仔细阅读合规说明后再进行操作。',
    type: 'system',
    read: true,
    createdAt: '2026-06-03 15:30'
  }
]
