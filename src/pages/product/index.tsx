import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import TagFilter from '@/components/TagFilter';
import ProductCard from '@/components/ProductCard';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const categories = ['全部', '企业征信', '交通出行', '医疗健康', '电商零售', '金融风控', '物流运输', '智慧城市', '农业科技', '教育科研', '环境气象'];

const ProductPage: React.FC = () => {
  const products = useAppStore(s => s.products);
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === '全部') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  const handleProductClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/dataDetail/index?id=${id}` });
  };

  const handleUpload = () => {
    Taro.navigateTo({ url: '/pages/publishProduct/index' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.searchWrap}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchPlaceholder}>搜索数据产品</Text>
        </View>
      </View>

      <View className={styles.filterWrap}>
        <TagFilter tags={categories} selected={selectedCategory} onChange={setSelectedCategory} />
      </View>

      <ScrollView scrollY className={styles.listWrap} style={{ height: 'calc(100vh - 280rpx)' }}>
        <View className={styles.productList}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={handleProductClick} />
          ))}
        </View>
      </ScrollView>

      <View className={styles.fab} onClick={handleUpload}>
        <Text className={styles.fabIcon}>📤</Text>
        <Text className={styles.fabText}>上架</Text>
      </View>
    </View>
  );
};

export default ProductPage;
