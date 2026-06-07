import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/data/products';
import styles from './index.module.scss';

const CollectionPage: React.FC = () => {
  const [collected] = useState(mockProducts.slice(0, 4));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleProductClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/dataDetail/index?id=${id}` });
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) {
      Taro.showToast({ title: '请至少选择2个产品进行对比', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '对比功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY style={{ height: 'calc(100vh - 120rpx)' }}>
        <View className={styles.listWrap}>
          {collected.map(product => (
            <ProductCard key={product.id} product={product} onClick={handleProductClick} compact />
          ))}
        </View>
      </ScrollView>

      <View className={styles.compareBar}>
        <Text className={styles.compareInfo}>已选择 {selectedIds.length} 项</Text>
        <View className={styles.compareBtn} onClick={handleCompare}>
          <Text className={styles.compareBtnText}>对比</Text>
        </View>
      </View>
    </View>
  );
};

export default CollectionPage;
