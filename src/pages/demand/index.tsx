import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import TagFilter from '@/components/TagFilter';
import DemandCard from '@/components/DemandCard';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const categories = ['全部', '企业征信', '交通出行', '医疗健康', '金融风控', '电商零售', '工业制造', '新能源', '农业科技'];

const DemandPage: React.FC = () => {
  const demands = useAppStore(s => s.demands);
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredDemands = useMemo(() => {
    if (selectedCategory === '全部') return demands;
    return demands.filter(d => d.category === selectedCategory);
  }, [selectedCategory, demands]);

  const handleDemandClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/demandDetail/index?id=${id}` });
  };

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/publishDemand/index' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.searchWrap}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchPlaceholder}>搜索需求关键词</Text>
        </View>
      </View>

      <View className={styles.filterWrap}>
        <TagFilter tags={categories} selected={selectedCategory} onChange={setSelectedCategory} />
      </View>

      <ScrollView scrollY className={styles.listWrap} style={{ height: 'calc(100vh - 280rpx)' }}>
        <View className={styles.demandList}>
          {filteredDemands.map(demand => (
            <DemandCard key={demand.id} demand={demand} onClick={handleDemandClick} />
          ))}
        </View>
      </ScrollView>

      <View className={styles.fab} onClick={handlePublish}>
        <Text className={styles.fabIcon}>✏️</Text>
        <Text className={styles.fabText}>发布</Text>
      </View>
    </View>
  );
};

export default DemandPage;
