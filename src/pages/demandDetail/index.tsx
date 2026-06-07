import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const statusLabels: Record<string, string> = {
  open: '进行中',
  in_progress: '洽谈中',
  closed: '已关闭'
};

const DemandDetailPage: React.FC = () => {
  const router = useRouter();
  const demands = useAppStore(s => s.demands);
  const demand = demands.find(d => d.id === router.params.id) || demands[0];

  const handleQuote = () => {
    Taro.navigateTo({ url: `/pages/inquiry/index?id=${demand.id}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{demand.title}</Text>
        <View className={styles.tags}>
          {demand.tags.map(tag => (
            <Text key={tag} className={styles.tag}>{tag}</Text>
          ))}
        </View>
        <View className={styles.metaRow}>
          <View style={{ display: 'flex', alignItems: 'baseline' }}>
            <Text className={styles.budget}>¥{demand.budget}</Text>
            <Text className={styles.budgetUnit}>/{demand.budgetUnit}</Text>
          </View>
          <Text className={styles.deadline}>截止：{demand.deadline}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>需求描述</Text>
        <Text className={styles.desc}>{demand.description}</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>需方信息</Text>
        <View className={styles.demander}>
          <Image className={styles.demanderAvatar} src={demand.demanderAvatar} mode="aspectFill" />
          <View className={styles.demanderInfo}>
            <Text className={styles.demanderName}>{demand.demander}</Text>
            <Text className={styles.demanderLabel}>数据需方 · 认证企业</Text>
          </View>
        </View>
        <View className={styles.responseInfo}>
          <View className={styles.responseStat}>
            <Text className={styles.responseValue}>{demand.responseCount}</Text>
            <Text className={styles.responseLabel}>响应数</Text>
          </View>
          <View className={styles.responseStat}>
            <Text className={styles.responseValue}>{statusLabels[demand.status]}</Text>
            <Text className={styles.responseLabel}>状态</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.primaryBtn} onClick={handleQuote}>
          <Text className={styles.primaryBtnText}>立即报价</Text>
        </View>
      </View>
    </View>
  );
};

export default DemandDetailPage;
