import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';

const evaluations = [
  { id: 'e1', targetName: '全国企业工商注册数据集', rating: 5, content: '数据质量非常好，覆盖面广，更新及时，API接口稳定可靠。', author: '金信评估', date: '2026-06-05' },
  { id: 'e2', targetName: '气象环境监测数据服务', rating: 4, content: '数据准确度较高，接口响应速度快，部分站点数据有延迟。', author: '农数科技', date: '2026-06-04' },
  { id: 'e3', targetName: '物流运输轨迹数据集', rating: 5, content: '轨迹数据精确，覆盖范围广，对供应链优化帮助很大。', author: '运链数据', date: '2026-05-28' },
  { id: 'e4', targetName: '医疗健康统计年鉴数据', rating: 4, content: '数据来源权威，维度丰富，但部分细分数据粒度可以更细。', author: '医数智能', date: '2026-05-20' }
];

const EvaluationPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.listWrap}>
          {evaluations.map(evalItem => (
            <View key={evalItem.id} className={styles.evalCard}>
              <View className={styles.evalHeader}>
                <Text className={styles.evalTarget}>{evalItem.targetName}</Text>
                <Text className={styles.evalDate}>{evalItem.date}</Text>
              </View>
              <Text className={styles.evalStars}>{'⭐'.repeat(evalItem.rating)}</Text>
              <Text className={styles.evalContent}>{evalItem.content}</Text>
              <Text className={styles.evalAuthor}>评价人：{evalItem.author}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default EvaluationPage;
