import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import { ProgressNode } from '@/types';
import styles from './index.module.scss';

const statusLabels: Record<string, string> = {
  pending: '待确认',
  negotiating: '沟通中',
  compliance: '合规中',
  confirmed: '已确认',
  delivering: '交付中',
  completed: '已完成',
  withdrawn: '已撤回'
};

const statusStyles: Record<string, string> = {
  pending: styles.statusPending,
  negotiating: styles.statusNegotiating,
  compliance: styles.statusCompliance,
  confirmed: styles.statusConfirmed,
  delivering: styles.statusDelivering,
  completed: styles.statusCompleted,
  withdrawn: styles.statusWithdrawn
};

const tabs = ['全部', '待确认', '沟通中', '合规中', '已确认', '交付中', '已完成', '已撤回'];
const statusFilterMap: Record<string, string | undefined> = {
  '全部': undefined,
  '待确认': 'pending',
  '沟通中': 'negotiating',
  '合规中': 'compliance',
  '已确认': 'confirmed',
  '交付中': 'delivering',
  '已完成': 'completed',
  '已撤回': 'withdrawn'
};

const allProgressNodes: ProgressNode[] = [
  { title: '意向提交', description: '供需双方达成初步意向', completed: true },
  { title: '询价沟通', description: '双方就价格和服务内容进行沟通', completed: false },
  { title: '合规审核', description: '提交合规材料，等待审核通过', completed: false },
  { title: '合同签署', description: '双方确认合同条款并签署', completed: false },
  { title: '数据交付', description: '供方按约定方式交付数据', completed: false },
  { title: '交易完成', description: '需方确认数据接收，完成评价', completed: false }
];

const statusNodeMap: Record<string, number> = {
  pending: 1,
  negotiating: 2,
  compliance: 3,
  confirmed: 4,
  delivering: 5,
  completed: 6,
  withdrawn: 0
};

let msgIdCounter = 600;

const ProgressPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id;
  const intentionOrders = useAppStore(s => s.intentionOrders);
  const updateOrderStatus = useAppStore(s => s.updateOrderStatus);
  const addMessage = useAppStore(s => s.addMessage);
  const messages = useAppStore(s => s.messages);

  if (orderId) {
    const order = intentionOrders.find(o => o.id === orderId);
    if (!order) {
      return (
        <View className={styles.container}>
          <View className={styles.section}>
            <Text style={{ color: '#86909C', textAlign: 'center', display: 'block' }}>未找到该意向单</Text>
          </View>
        </View>
      );
    }

    const orderStatus = order.status;
    const currentNode = statusNodeMap[orderStatus] ?? 3;
    const progressNodes: ProgressNode[] = allProgressNodes.map((node, index) => {
      const completed = index < currentNode;
      const date = completed ? order.createdAt : undefined;
      return { ...node, completed, date };
    });
    const currentNodeIndex = progressNodes.findIndex(n => !n.completed);

    const handleWithdraw = () => {
      Taro.showModal({
        title: '确认撤回',
        content: '撤回后交易将终止，确认撤回吗？',
        success: (res) => {
          if (res.confirm) {
            updateOrderStatus(order.id, 'withdrawn');
            addMessage({
              id: `msg_${++msgIdCounter}`, title: '交易已撤回',
              content: `订单"${order.productTitle}"已被撤回，交易终止。`,
              type: 'progress', subtype: 'status', read: false, createdAt: new Date().toISOString().slice(0, 10),
              linkUrl: `/pages/intentionDetail/index?id=${order.id}`, orderId: order.id
            });
            Taro.showToast({ title: '已撤回申请', icon: 'success' });
          }
        }
      });
    };

    const handleConfirm = () => {
      Taro.showModal({
        title: '确认成交',
        content: '确认当前交易达成？',
        success: (res) => {
          if (res.confirm) {
            updateOrderStatus(order.id, 'delivering', '交易已确认，进入交付阶段');
            addMessage({
              id: `msg_${++msgIdCounter}`, title: '交易已确认',
              content: `订单"${order.productTitle}"已确认成交，进入数据交付阶段。`,
              type: 'transaction', subtype: 'delivery', read: false, createdAt: new Date().toISOString().slice(0, 10),
              linkUrl: `/pages/intentionDetail/index?id=${order.id}`, orderId: order.id
            });
            Taro.showToast({ title: '已确认成交', icon: 'success' });
          }
        }
      });
    };

    const getDotStyle = (index: number, node: ProgressNode) => {
      if (node.completed) return styles.timelineDotDone;
      if (index === currentNodeIndex) return styles.timelineDotCurrent;
      return styles.timelineDot;
    };
    const getTitleStyle = (index: number, node: ProgressNode) => {
      if (node.completed) return styles.timelineTitleDone;
      if (index === currentNodeIndex) return styles.timelineTitleCurrent;
      return styles.timelineTitle;
    };

    const isWithdrawn = orderStatus === 'withdrawn';
    const isCompleted = orderStatus === 'completed';
    const isDelivering = orderStatus === 'delivering';

    return (
      <View className={styles.container}>
        <View className={styles.orderInfo}>
          <Text className={styles.orderTitle}>{order.productTitle}</Text>
          <View className={styles.orderMeta}>
            <Text className={styles.orderId}>订单号：{order.id}</Text>
            <Text className={styles.orderStatus}>{statusLabels[orderStatus]}</Text>
          </View>
        </View>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>进度节点</Text>
          <View className={styles.timeline}>
            {progressNodes.map((node, index) => (
              <View key={node.title} className={styles.timelineItem}>
                <View className={getDotStyle(index, node)}>
                  {node.completed && <Text style={{ fontSize: '14rpx', color: '#fff' }}>✓</Text>}
                </View>
                {index < progressNodes.length - 1 && (
                  <View className={classnames(styles.timelineLine, node.completed && styles.timelineLineDone)} />
                )}
                <Text className={getTitleStyle(index, node)}>{node.title}</Text>
                <Text className={styles.timelineDesc}>{node.description}</Text>
                {node.date && <Text className={styles.timelineDate}>{node.date}</Text>}
              </View>
            ))}
          </View>
        </View>
        {!isWithdrawn && !isCompleted && !isDelivering && (
          <View className={styles.actionArea}>
            <View className={styles.withdrawBtn} onClick={handleWithdraw}>
              <Text className={styles.withdrawBtnText}>撤回申请</Text>
            </View>
            <View className={styles.confirmBtn} onClick={handleConfirm}>
              <Text className={styles.confirmBtnText}>确认成交</Text>
            </View>
          </View>
        )}
        {isDelivering && (
          <View className={styles.actionArea}>
            <View className={styles.deliveringBtn}>
              <Text className={styles.deliveringBtnText}>📦 数据交付中</Text>
            </View>
          </View>
        )}
        {isCompleted && (
          <View className={styles.actionArea}>
            <View className={styles.completedBtn}>
              <Text className={styles.completedBtnText}>✓ 交易已完成</Text>
            </View>
          </View>
        )}
        {isWithdrawn && (
          <View className={styles.actionArea}>
            <View className={styles.withdrawnBtn}>
              <Text className={styles.withdrawnBtnText}>交易已撤回</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  const [activeTab, setActiveTab] = useState(0);
  const filteredOrders = intentionOrders.filter(order => {
    const status = statusFilterMap[tabs[activeTab]];
    return !status || order.status === status;
  });

  const getOrderUnreadCount = (orderId: string) => messages.filter(m => m.orderId === orderId && !m.read).length;

  const handleOrderClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/progress/index?id=${id}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.tabs}>
        <ScrollView scrollX style={{ width: '100%', whiteSpace: 'nowrap' }}>
          <View className={styles.tabsInner}>
            {tabs.map((tab, index) => (
              <View key={tab} className={styles.tab} onClick={() => setActiveTab(index)}>
                <Text className={classnames(styles.tabText, activeTab === index && styles.tabTextActive)}>{tab}</Text>
                {activeTab === index && <View className={styles.tabLine} />}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView scrollY className={styles.listWrap} style={{ height: 'calc(100vh - 88rpx)' }}>
        <View className={styles.orderList}>
          {filteredOrders.map(order => {
            const unread = getOrderUnreadCount(order.id);
            return (
              <View key={order.id} className={styles.orderCard} onClick={() => handleOrderClick(order.id)}>
                {unread > 0 && <View className={styles.cardDot} />}
                <View className={styles.cardHeader}>
                  <Text className={classnames(styles.orderType, order.type === 'supply' ? styles.typeSupply : styles.typeDemand)}>
                    {order.type === 'supply' ? '供方' : '需方'}
                  </Text>
                  <Text className={classnames(styles.orderStatus, statusStyles[order.status])}>
                    {statusLabels[order.status]}
                  </Text>
                </View>
                <Text className={styles.cardTitle}>{order.productTitle}</Text>
                <View className={styles.cardQuoteRow}>
                  <Text className={styles.cardQuoteLabel}>报价</Text>
                  <Text className={styles.cardQuoteValue}>{order.quoteAmount}</Text>
                </View>
                {order.lastMessage && (
                  <View className={styles.cardLastMsg}>
                    <Text className={styles.cardLastMsgText}>{order.lastMessage}</Text>
                  </View>
                )}
                <View className={styles.cardFooter}>
                  <Text className={styles.cardCounterparty}>{order.counterparty}</Text>
                  <Text className={styles.cardDate}>{order.updatedAt}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProgressPage;
