import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { DataProduct } from '@/types';
import styles from './index.module.scss';

interface ProductCardProps {
  product: DataProduct;
  onClick?: (id: string) => void;
  compact?: boolean;
}

const riskMap: Record<string, { label: string; style: string }> = {
  low: { label: '低风险', style: styles.tagGreen },
  medium: { label: '中风险', style: styles.tagOrange },
  high: { label: '高风险', style: styles.tagRed }
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, compact }) => {
  const risk = riskMap[product.riskLevel];

  return (
    <View className={classnames(styles.card, compact && styles.compact)} onClick={() => onClick?.(product.id)}>
      <Image className={styles.cover} src={product.coverImage} mode="aspectFill" />
      <View className={styles.info}>
        <Text className={styles.title}>{product.title}</Text>
        {!compact && <Text className={styles.desc}>{product.description}</Text>}
        <View className={styles.tags}>
          {product.tags.slice(0, 3).map(tag => (
            <Text key={tag} className={styles.tag}>{tag}</Text>
          ))}
          <Text className={classnames(styles.tag, risk.style)}>{risk.label}</Text>
        </View>
        <View className={styles.bottom}>
          <Text className={styles.price}>¥{product.price}<Text className={styles.priceUnit}>/{product.priceUnit}</Text></Text>
          <Text className={styles.views}>{product.viewCount}次浏览</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
