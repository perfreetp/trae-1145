import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const DataDetailPage: React.FC = () => {
  const router = useRouter();
  const products = useAppStore(s => s.products);
  const product = products.find(p => p.id === router.params.id) || products[0];
  const [collected, setCollected] = useState(false);

  const riskStyleMap: Record<string, string> = {
    low: styles.riskLow,
    medium: styles.riskMedium,
    high: styles.riskHigh
  };

  const riskLabelMap: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险'
  };

  const handleCollect = () => {
    setCollected(!collected);
    Taro.showToast({ title: collected ? '已取消收藏' : '已收藏', icon: 'none' });
  };

  const handleInquiry = () => {
    Taro.navigateTo({ url: `/pages/inquiry/index?id=${product.id}` });
  };

  const handleSample = () => {
    Taro.showToast({ title: '样例数据预览功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.coverWrap}>
        <Image className={styles.cover} src={product.coverImage} mode="aspectFill" />
        <View className={`${styles.riskBadge} ${riskStyleMap[product.riskLevel]}`}>
          <Text>{riskLabelMap[product.riskLevel]}</Text>
        </View>
      </View>

      <View className={styles.mainInfo}>
        <Text className={styles.title}>{product.title}</Text>
        <View className={styles.tags}>
          {product.tags.map(tag => (
            <Text key={tag} className={styles.tag}>{tag}</Text>
          ))}
        </View>
        <View className={styles.priceRow}>
          <Text className={styles.price}>¥{product.price}</Text>
          <Text className={styles.priceUnit}>/{product.priceUnit}</Text>
        </View>
      </View>

      <View className={styles.provider}>
        <Image className={styles.providerAvatar} src={product.providerAvatar} mode="aspectFill" />
        <View className={styles.providerInfo}>
          <Text className={styles.providerName}>{product.provider}</Text>
          <Text className={styles.providerLabel}>数据供方 · 认证企业</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>数据简介</Text>
        <Text className={styles.desc}>{product.description}</Text>
        {product.sampleAvailable && (
          <View className={styles.sampleBtn} onClick={handleSample}>
            <Text className={styles.sampleBtnText}>📄 预览样例数据</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>数据统计</Text>
        <View className={styles.statRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{product.viewCount}</Text>
            <Text className={styles.statLabel}>浏览次数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{product.collectCount}</Text>
            <Text className={styles.statLabel}>收藏次数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{product.updateDate}</Text>
            <Text className={styles.statLabel}>最近更新</Text>
          </View>
        </View>
      </View>

      {product.riskLevel !== 'low' && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>风险提示</Text>
          <View className={styles.riskAlert}>
            <Text className={styles.riskAlertIcon}>⚠️</Text>
            <View className={styles.riskAlertContent}>
              <Text className={styles.riskAlertTitle}>
                {product.riskLevel === 'high' ? '高风险数据产品' : '中风险数据产品'}
              </Text>
              <Text className={styles.riskAlertDesc}>
                {product.riskLevel === 'high'
                  ? '该数据产品涉及敏感数据领域，请在使用前仔细阅读合规要求，确保使用场景符合相关法规政策。'
                  : '该数据产品存在一定合规要求，建议在使用前确认数据授权范围和使用限制。'}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        <View className={styles.actionBtn} onClick={handleCollect}>
          <Text className={styles.actionBtnIcon}>{collected ? '❤️' : '🤍'}</Text>
          <Text className={styles.actionBtnText}>{collected ? '已收藏' : '收藏'}</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleInquiry}>
          <Text className={styles.primaryBtnText}>在线询价</Text>
        </View>
      </View>
    </View>
  );
};

export default DataDetailPage;
