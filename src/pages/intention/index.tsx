import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { IntentionOrder } from '@/types';
import classnames from 'classnames';
import styles from './index.module.scss';

const mockOrders: IntentionOrder[] = [
  { id: 'io1', productId: 'p1', productTitle: '全国企业工商注册数据集', type: 'supply', status: 'pending', createdAt: '2026-06-07', updatedAt: '2026-06-08', counterparty: '金信评估' },
  { id: 'io2', productId: 'p2', productTitle: '城市交通流量实时数据', type: 'demand', status: 'negotiating', createdAt: '2026-06-05', updatedAt: '2026-06-08', counterparty: '智途科技' },
  { id: 'io3', productId: 'p4', productTitle: '电商用户行为分析数据集', type: 'supply', status: 'compliance', createdAt: '2026-06-02', updatedAt: '2026-06-07', counterparty: '商云网络' },
  { id: 'io4', productId: 'p5', productTitle: '气象环境监测数据服务', type: 'demand', status: 'confirmed', createdAt: '2026-05-28', updatedAt: '2026-06-04', counterparty: '农数科技' },
  { id: 'io5', productId: 'p6', productTitle: '金融信贷风险评估数据', type: 'supply', status: 'withdrawn', createdAt: '2026-05-20', updatedAt: '2026-05-25', counterparty: '银盾金科' },
  { id: 'io6', productId: 'p7', productTitle: '物流运输轨迹数据集', type: 'demand', status: 'pending', createdAt: '2026-06-06', updatedAt: '2026-06-07', counterparty: '运链数据' },
  { id: 'io7', productId: 'p3', productTitle: '医疗健康统计年鉴数据', type: 'supply', status: 'negotiating', createdAt: '2026-06-01', updatedAt: '2026-06-06', counterparty: '医数智能' }
];

const statusLabels: Record<string, string> = {
  pending: '待确认',
  negotiating: '洽谈中',
  compliance: '合规审核',
  confirmed: '已确认',
  withdrawn: '已撤回'
};

const statusStyles: Record<string, string> = {
  pending: styles.statusPending,
  negotiating: styles.statusNegotiating,
  compliance: styles.statusCompliance,
  confirmed: styles.statusConfirmed,
  withdrawn: styles.statusWithdrawn
};

const tabs = ['全部', '待确认', '洽谈中', '合规审核', '已确认', '已撤回'];
const statusFilterMap: Record<string, string | undefined> = {
  '全部': undefined,
  '待确认': 'pending',
  '洽谈中': 'negotiating',
  '合规审核': 'compliance',
  '已确认': 'confirmed',
  '已撤回': 'withdrawn'
};

const IntentionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const filteredOrders = mockOrders.filter(order => {
    const status = statusFilterMap[tabs[activeTab]];
    return !status || order.status === status;
  });

  const handleOrderClick = (order: IntentionOrder) => {
    Taro.navigateTo({ url: `/pages/progress/index?id=${order.id}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.tabs}>
        {tabs.map((tab, index) => (
          <View key={tab} className={styles.tab} onClick={() => setActiveTab(index)}>
            <Text className={classnames(styles.tabText, activeTab === index && styles.tabTextActive)}>{tab}</Text>
            {activeTab === index && <View className={styles.tabLine} />}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.listWrap} style={{ height: 'calc(100vh - 88rpx)' }}>
        <View className={styles.orderList}>
          {filteredOrders.map(order => (
            <View key={order.id} className={styles.orderCard} onClick={() => handleOrderClick(order)}>
              <View className={styles.orderHeader}>
                <Text className={classnames(styles.orderType, order.type === 'supply' ? styles.typeSupply : styles.typeDemand)}>
                  {order.type === 'supply' ? '供方意向' : '需方意向'}
                </Text>
                <Text className={classnames(styles.orderStatus, statusStyles[order.status])}>
                  {statusLabels[order.status]}
                </Text>
              </View>
              <Text className={styles.orderTitle}>{order.productTitle}</Text>
              <View className={styles.orderInfo}>
                <Text className={styles.orderCounterparty}>合作方：{order.counterparty}</Text>
                <Text className={styles.orderDate}>{order.updatedAt}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default IntentionPage;
