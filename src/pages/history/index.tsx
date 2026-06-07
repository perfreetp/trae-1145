import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const HistoryPage: React.FC = () => {
  const intentionOrders = useAppStore(s => s.intentionOrders);
  const completedOrders = intentionOrders.filter(o => o.status === 'completed');

  const handleClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/intentionDetail/index?id=${id}` });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.historyList}>
          {completedOrders.map(order => (
            <View key={order.id} className={styles.historyCard} onClick={() => handleClick(order.id)}>
              <View className={styles.historyHeader}>
                <Text className={styles.historyTitle}>{order.productTitle}</Text>
                <Text className={styles.historyStatus}>已完成</Text>
              </View>
              <View className={styles.historyInfo}>
                <Text className={styles.historyPartner}>合作方：{order.counterparty}</Text>
                <Text className={styles.historyDate}>{order.updatedAt}</Text>
              </View>
              <Text className={styles.historyAmount}>{order.quoteAmount}</Text>
            </View>
          ))}
          {completedOrders.length === 0 && (
            <View className={styles.emptyWrap}>
              <Text className={styles.emptyText}>暂无历史合作记录</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HistoryPage;
