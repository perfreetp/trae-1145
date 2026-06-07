import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import { ProgressNode } from '@/types';
import styles from './index.module.scss';

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
  confirmed: 5,
  withdrawn: 0
};

const statusLabelMap: Record<string, string> = {
  pending: '待确认',
  negotiating: '洽谈中',
  compliance: '合规审核',
  confirmed: '已确认',
  withdrawn: '已撤回'
};

let msgIdCounter = 600;

const ProgressPage: React.FC = () => {
  const router = useRouter();
  const intentionOrders = useAppStore(s => s.intentionOrders);
  const updateOrderStatus = useAppStore(s => s.updateOrderStatus);
  const addMessage = useAppStore(s => s.addMessage);
  const order = intentionOrders.find(o => o.id === router.params.id);

  const orderTitle = order?.productTitle || '城市交通流量实时数据';
  const orderId = order?.id || 'SLT20260602001';
  const orderStatus = order?.status || 'compliance';
  const currentNode = statusNodeMap[orderStatus] ?? 3;
  const today = order?.createdAt || '2026-06-02';

  const progressNodes: ProgressNode[] = allProgressNodes.map((node, index) => {
    const completed = index < currentNode;
    const date = completed ? today : undefined;
    return { ...node, completed, date };
  });

  const currentNodeIndex = progressNodes.findIndex(n => !n.completed);

  const handleWithdraw = () => {
    Taro.showModal({
      title: '确认撤回',
      content: '撤回后交易将终止，确认撤回吗？',
      success: (res) => {
        if (res.confirm) {
          updateOrderStatus(orderId, 'withdrawn');
          const now = new Date();
          const timeStr = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          addMessage({
            id: `msg_${++msgIdCounter}`,
            title: '交易已撤回',
            content: `订单"${orderTitle}"已被撤回，交易终止。`,
            type: 'progress',
            read: false,
            createdAt: timeStr,
            linkUrl: `/pages/progress/index?id=${orderId}`
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
          updateOrderStatus(orderId, 'confirmed');
          const now = new Date();
          const timeStr = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          addMessage({
            id: `msg_${++msgIdCounter}`,
            title: '交易已确认',
            content: `订单"${orderTitle}"已确认成交，请等待数据交付。`,
            type: 'transaction',
            read: false,
            createdAt: timeStr,
            linkUrl: `/pages/progress/index?id=${orderId}`
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
  const isConfirmed = orderStatus === 'confirmed';

  return (
    <View className={styles.container}>
      <View className={styles.orderInfo}>
        <Text className={styles.orderTitle}>{orderTitle}</Text>
        <View className={styles.orderMeta}>
          <Text className={styles.orderId}>订单号：{orderId}</Text>
          <Text className={styles.orderStatus}>{statusLabelMap[orderStatus]}</Text>
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

      {!isWithdrawn && !isConfirmed && (
        <View className={styles.actionArea}>
          <View className={styles.withdrawBtn} onClick={handleWithdraw}>
            <Text className={styles.withdrawBtnText}>撤回申请</Text>
          </View>
          <View className={styles.confirmBtn} onClick={handleConfirm}>
            <Text className={styles.confirmBtnText}>确认成交</Text>
          </View>
        </View>
      )}

      {isConfirmed && (
        <View className={styles.actionArea}>
          <View className={styles.confirmedBtn}>
            <Text className={styles.confirmedBtnText}>✓ 交易已确认</Text>
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
};

export default ProgressPage;
