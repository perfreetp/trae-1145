import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { Demand } from '@/types';
import styles from './index.module.scss';

interface DemandCardProps {
  demand: Demand;
  onClick?: (id: string) => void;
}

const statusMap: Record<string, { label: string; style: string }> = {
  open: { label: '进行中', style: styles.statusOpen },
  in_progress: { label: '洽谈中', style: styles.statusProgress },
  closed: { label: '已关闭', style: styles.statusClosed }
};

const DemandCard: React.FC<DemandCardProps> = ({ demand, onClick }) => {
  const status = statusMap[demand.status];

  return (
    <View className={styles.card} onClick={() => onClick?.(demand.id)}>
      <View className={styles.header}>
        <View className={styles.user}>
          <Image className={styles.avatar} src={demand.demanderAvatar} mode="aspectFill" />
          <Text className={styles.name}>{demand.demander}</Text>
        </View>
        <Text className={classnames(styles.status, status.style)}>{status.label}</Text>
      </View>
      <Text className={styles.title}>{demand.title}</Text>
      <Text className={styles.desc}>{demand.description}</Text>
      <View className={styles.tags}>
        {demand.tags.slice(0, 3).map(tag => (
          <Text key={tag} className={styles.tag}>{tag}</Text>
        ))}
      </View>
      <View className={styles.bottom}>
        <Text className={styles.budget}>预算 ¥{demand.budget}<Text className={styles.budgetUnit}>/{demand.budgetUnit}</Text></Text>
        <Text className={styles.response}>{demand.responseCount}人响应</Text>
      </View>
      <View className={styles.deadline}>
        <Text className={styles.deadlineText}>截止日期：{demand.deadline}</Text>
      </View>
    </View>
  );
};

export default DemandCard;
