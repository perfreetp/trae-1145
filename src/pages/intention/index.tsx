import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

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
  const intentionOrders = useAppStore(s => s.intentionOrders);
  const [activeTab, setActiveTab] = useState(0);

  const filteredOrders = intentionOrders.filter(order => {
    const status = statusFilterMap[tabs[activeTab]];
    return !status || order.status === status;
  });

  const handleOrderClick = (orderId: string) => {
    Taro.navigateTo({ url: `/pages/intentionDetail/index?id=${orderId}` });
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
            <View key={order.id} className={styles.orderCard} onClick={() => handleOrderClick(order.id)}>
              <View className={styles.orderHeader}>
                <Text className={classnames(styles.orderType, order.type === 'supply' ? styles.typeSupply : styles.typeDemand)}>
                  {order.type === 'supply' ? '供方意向' : '需方意向'}
                </Text>
                <Text className={classnames(styles.orderStatus, statusStyles[order.status])}>
                  {statusLabels[order.status]}
                </Text>
              </View>
              <Text className={styles.orderTitle}>{order.productTitle}</Text>
              <View className={styles.orderQuoteRow}>
                <Text className={styles.orderQuoteLabel}>报价</Text>
                <Text className={styles.orderQuoteValue}>{order.quoteAmount}</Text>
              </View>
              {order.lastMessage && (
                <View className={styles.orderLastMsg}>
                  <Text className={styles.orderLastMsgText}>{order.lastMessage}</Text>
                </View>
              )}
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
