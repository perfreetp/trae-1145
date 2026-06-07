import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ProgressNode } from '@/types';
import classnames from 'classnames';
import styles from './index.module.scss';

const progressNodes: ProgressNode[] = [
  { title: '意向提交', description: '供需双方达成初步意向', completed: true, date: '2026-06-02' },
  { title: '询价沟通', description: '双方就价格和服务内容进行沟通', completed: true, date: '2026-06-04' },
  { title: '合规审核', description: '提交合规材料，等待审核通过', completed: true, date: '2026-06-07' },
  { title: '合同签署', description: '双方确认合同条款并签署', completed: false },
  { title: '数据交付', description: '供方按约定方式交付数据', completed: false },
  { title: '交易完成', description: '需方确认数据接收，完成评价', completed: false }
];

const currentNodeIndex = progressNodes.findIndex(n => !n.completed);

const ProgressPage: React.FC = () => {
  const handleWithdraw = () => {
    Taro.showModal({
      title: '确认撤回',
      content: '撤回后交易将终止，确认撤回吗？',
      success: (res) => {
        if (res.confirm) {
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

  return (
    <View className={styles.container}>
      <View className={styles.orderInfo}>
        <Text className={styles.orderTitle}>城市交通流量实时数据</Text>
        <View className={styles.orderMeta}>
          <Text className={styles.orderId}>订单号：SLT20260602001</Text>
          <Text className={styles.orderStatus}>合规审核通过</Text>
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

      <View className={styles.actionArea}>
        <View className={styles.withdrawBtn} onClick={handleWithdraw}>
          <Text className={styles.withdrawBtnText}>撤回申请</Text>
        </View>
        <View className={styles.confirmBtn} onClick={handleConfirm}>
          <Text className={styles.confirmBtnText}>确认成交</Text>
        </View>
      </View>
    </View>
  );
};

export default ProgressPage;
