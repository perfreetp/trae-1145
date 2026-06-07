import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import ProductCard from '@/components/ProductCard';
import { useAppStore } from '@/store';
import { DataProduct } from '@/types';
import styles from './index.module.scss';

const CollectionPage: React.FC = () => {
  const products = useAppStore(s => s.products);
  const [collected] = useState<DataProduct[]>(products.slice(0, 4));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleProductClick = (id: string) => {
    if (!showCompare) {
      Taro.navigateTo({ url: `/pages/dataDetail/index?id=${id}` });
    }
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) {
      Taro.showToast({ title: '请至少选择2个产品进行对比', icon: 'none' });
      return;
    }
    setShowCompare(true);
  };

  const selectedProducts = collected.filter(p => selectedIds.includes(p.id));

  const riskLabel: Record<string, string> = { low: '低风险', medium: '中风险', high: '高风险' };

  const compareFields: Array<{ label: string; key: string; render: (p: DataProduct) => string }> = [
    { label: '价格', key: 'price', render: p => `¥${p.price}/${p.priceUnit}` },
    { label: '行业', key: 'category', render: p => p.category },
    { label: '风险等级', key: 'risk', render: p => riskLabel[p.riskLevel] },
    { label: '样例数据', key: 'sample', render: p => p.sampleAvailable ? '可用' : '不可用' },
    { label: '更新时间', key: 'date', render: p => p.updateDate },
    { label: '浏览量', key: 'views', render: p => `${p.viewCount}次` },
    { label: '收藏量', key: 'collects', render: p => `${p.collectCount}次` }
  ];

  return (
    <View className={styles.container}>
      <ScrollView scrollY style={{ height: showCompare ? '50vh' : 'calc(100vh - 120rpx)' }}>
        <View className={styles.listWrap}>
          {collected.map(product => (
            <View key={product.id} className={styles.cardRow}>
              <View className={styles.checkWrap} onClick={() => toggleSelect(product.id)}>
                <View className={classnames(styles.checkBox, selectedIds.includes(product.id) && styles.checkBoxChecked)}>
                  {selectedIds.includes(product.id) && <Text className={styles.checkBoxText}>✓</Text>}
                </View>
              </View>
              <ProductCard product={product} onClick={handleProductClick} compact />
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.compareBar}>
        <Text className={styles.compareInfo}>已选择 {selectedIds.length} 项</Text>
        <View className={styles.compareBtn} onClick={handleCompare}>
          <Text className={styles.compareBtnText}>对比</Text>
        </View>
      </View>

      {showCompare && (
        <View className={styles.overlay} onClick={() => setShowCompare(false)}>
          <View className={styles.comparePanel} onClick={e => e.stopPropagation()}>
            <View className={styles.panelHeader}>
              <Text className={styles.panelTitle}>产品对比</Text>
              <Text className={styles.panelClose} onClick={() => setShowCompare(false)}>✕</Text>
            </View>
            <View className={styles.compareTable}>
              <View className={styles.compareRow}>
                <Text className={styles.compareLabel}>产品名称</Text>
                <View className={styles.compareValues}>
                  {selectedProducts.map(p => (
                    <Text key={p.id} className={styles.compareCell}>{p.title}</Text>
                  ))}
                </View>
              </View>
              {compareFields.map(field => (
                <View key={field.key} className={styles.compareRow}>
                  <Text className={styles.compareLabel}>{field.label}</Text>
                  <View className={styles.compareValues}>
                    {selectedProducts.map(p => (
                      <Text key={p.id} className={classnames(styles.compareCell, field.key === 'price' && styles.compareCellHighlight)}>
                        {field.render(p)}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
              <View className={styles.compareRow}>
                <Text className={styles.compareLabel}>标签</Text>
                <View className={styles.compareValues}>
                  {selectedProducts.map(p => (
                    <View key={p.id} className={styles.compareCell}>
                      {p.tags.map(tag => (
                        <Text key={tag} className={styles.compareTag}>{tag}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CollectionPage;
