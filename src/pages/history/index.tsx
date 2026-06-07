import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';

const historyData = [
  { id: 'h1', title: '全国企业工商注册数据集', partner: '金信评估', date: '2026-05-20', amount: '¥58,000' },
  { id: 'h2', title: '气象环境监测数据服务', partner: '农数科技', date: '2026-04-15', amount: '¥36,000' },
  { id: 'h3', title: '物流运输轨迹数据集', partner: '运链数据', date: '2026-03-28', amount: '¥45,000' },
  { id: 'h4', title: '医疗健康统计年鉴数据', partner: '医数智能', date: '2026-02-10', amount: '¥8,500' },
  { id: 'h5', title: '智慧城市IoT传感器数据', partner: '城数智联', date: '2026-01-22', amount: '¥78,000' },
  { id: 'h6', title: '教育行业数据分析报告', partner: '学研数据', date: '2025-12-18', amount: '¥15,000' },
  { id: 'h7', title: '农业种植监测遥感数据', partner: '农数科技', date: '2025-11-05', amount: '¥28,000' },
  { id: 'h8', title: '金融信贷风险评估数据', partner: '银盾金科', date: '2025-09-20', amount: '¥200,000' }
];

const HistoryPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.historyList}>
          {historyData.map(item => (
            <View key={item.id} className={styles.historyCard}>
              <View className={styles.historyHeader}>
                <Text className={styles.historyTitle}>{item.title}</Text>
                <Text className={styles.historyStatus}>已完成</Text>
              </View>
              <View className={styles.historyInfo}>
                <Text className={styles.historyPartner}>合作方：{item.partner}</Text>
                <Text className={styles.historyDate}>{item.date}</Text>
              </View>
              <Text className={styles.historyAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HistoryPage;
