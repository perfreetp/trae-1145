import React, { useState } from 'react';
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import ProductCard from '@/components/ProductCard';
import DemandCard from '@/components/DemandCard';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const banners = [
  { id: 'b1', image: 'https://picsum.photos/id/1/750/400', title: '数据要素市场化配置改革' },
  { id: 'b2', image: 'https://picsum.photos/id/160/750/400', title: '合规流通 安全共享' },
  { id: 'b3', image: 'https://picsum.photos/id/201/750/400', title: '数链通 智慧撮合平台' }
];

const quickEntries = [
  { icon: '📋', name: '需求大厅', path: '/pages/demand/index', color: styles.entryIconBlue },
  { icon: '🗄️', name: '数据产品', path: '/pages/product/index', color: styles.entryIconGreen },
  { icon: '🤝', name: '意向沟通', path: '/pages/intention/index', color: styles.entryIconOrange },
  { icon: '📄', name: '合规材料', path: '/pages/compliance/index', color: styles.entryIconPurple },
  { icon: '📊', name: '交易进度', path: '/pages/progress/index', color: styles.entryIconRed }
];

const HomePage: React.FC = () => {
  const products = useAppStore(s => s.products);
  const demands = useAppStore(s => s.demands);
  const [unreadCount] = useState(3);

  const handleProductClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/dataDetail/index?id=${id}` });
  };

  const handleDemandClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/demandDetail/index?id=${id}` });
  };

  const handleEntryClick = (path: string) => {
    if (path.includes('demand') || path.includes('product')) {
      Taro.switchTab({ url: path });
    } else {
      Taro.navigateTo({ url: path });
    }
  };

  const handleMessageClick = () => {
    Taro.navigateTo({ url: '/pages/message/index' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchText}>搜索数据产品或需求</Text>
        </View>
        <View className={styles.headerRight} onClick={handleMessageClick}>
          <Text className={styles.msgIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View className={styles.badge}>
              <Text className={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <Swiper className={styles.bannerWrap} autoplay circular indicatorDots indicatorColor="rgba(255,255,255,0.5)" indicatorActiveColor="#FFFFFF">
        {banners.map(banner => (
          <SwiperItem key={banner.id}>
            <Image className={styles.bannerItem} src={banner.image} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>

      <View className={styles.quickEntries}>
        {quickEntries.map(entry => (
          <View key={entry.name} className={styles.entryItem} onClick={() => handleEntryClick(entry.path)}>
            <View className={`${styles.entryIcon} ${entry.color}`}>
              <Text>{entry.icon}</Text>
            </View>
            <Text className={styles.entryName}>{entry.name}</Text>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>热门数据</Text>
          <Text className={styles.sectionMore} onClick={() => Taro.switchTab({ url: '/pages/product/index' })}>更多 ›</Text>
        </View>
        <View className={styles.productList}>
          {products.slice(0, 3).map(product => (
            <ProductCard key={product.id} product={product} onClick={handleProductClick} compact />
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>最新需求</Text>
          <Text className={styles.sectionMore} onClick={() => Taro.switchTab({ url: '/pages/demand/index' })}>更多 ›</Text>
        </View>
        <View className={styles.demandList}>
          {demands.slice(0, 3).map(demand => (
            <DemandCard key={demand.id} demand={demand} onClick={handleDemandClick} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default HomePage;
