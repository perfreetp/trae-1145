import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const menuItems = [
  {
    section: '交易管理',
    items: [
      { icon: '🤝', label: '意向沟通', desc: '查看意向单和询价记录', path: '/pages/intention/index' },
      { icon: '📄', label: '合规材料', desc: '上传材料、授权范围', path: '/pages/compliance/index' },
      { icon: '📊', label: '交易进度', desc: '查看交易节点和进度', path: '/pages/progress/index' }
    ]
  },
  {
    section: '沟通与评价',
    items: [
      { icon: '🔔', label: '消息提醒', desc: '系统通知和交易消息', path: '/pages/message/index', badge: 3 },
      { icon: '⭐', label: '评价记录', desc: '查看和发表评价', path: '/pages/evaluation/index' },
      { icon: '👥', label: '联系人管理', desc: '管理您的合作联系人', path: '/pages/contact/index' }
    ]
  },
  {
    section: '其他',
    items: [
      { icon: '⭐', label: '收藏比较', desc: '已收藏的数据产品', path: '/pages/collection/index' },
      { icon: '📋', label: '历史合作', desc: '查看历史合作记录', path: '/pages/history/index' }
    ]
  }
];

const MinePage: React.FC = () => {
  const handleMenuClick = (path: string) => {
    Taro.navigateTo({ url: path });
  };

  return (
    <View className={styles.container}>
      <View className={styles.profileCard}>
        <Image className={styles.avatar} src="https://picsum.photos/id/64/200/200" mode="aspectFill" />
        <View className={styles.userInfo}>
          <Text className={styles.userName}>张明远</Text>
          <Text className={styles.userCompany}>数联科技有限公司</Text>
          <Text className={styles.userRole}>数据供方</Text>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>5</Text>
          <Text className={styles.statLabel}>意向单</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>3</Text>
          <Text className={styles.statLabel}>交易中</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>12</Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
      </View>

      {menuItems.map(section => (
        <View key={section.section} className={styles.menuSection}>
          <Text className={styles.menuSectionTitle}>{section.section}</Text>
          {section.items.map(item => (
            <View key={item.label} className={styles.menuItem} onClick={() => handleMenuClick(item.path)}>
              <Text className={styles.menuIcon}>{item.icon}</Text>
              <View className={styles.menuContent}>
                <Text className={styles.menuLabel}>{item.label}</Text>
                <Text className={styles.menuDesc}>{item.desc}</Text>
              </View>
              {item.badge && (
                <View className={styles.menuBadge}>
                  <Text className={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default MinePage;
