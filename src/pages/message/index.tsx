import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { mockMessages } from '@/data/messages';
import classnames from 'classnames';
import styles from './index.module.scss';

const tabs = ['全部', '交易', '进度', '系统'];
const typeFilterMap: Record<number, string | undefined> = {
  0: undefined,
  1: 'transaction',
  2: 'progress',
  3: 'system'
};

const typeLabelMap: Record<string, { label: string; style: string }> = {
  system: { label: '系统', style: styles.typeSystem },
  transaction: { label: '交易', style: styles.typeTransaction },
  progress: { label: '进度', style: styles.typeProgress }
};

const MessagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const filteredMessages = mockMessages.filter(msg => {
    const type = typeFilterMap[activeTab];
    return !type || msg.type === type;
  });

  return (
    <View className={styles.container}>
      <View className={styles.tabs}>
        {tabs.map((tab, index) => (
          <View key={tab} className={styles.tab} onClick={() => setActiveTab(index)}>
            <Text className={classnames(styles.tabText, activeTab === index && styles.tabTextActive)}>{tab}</Text>
            {activeTab === index && <View className={styles.tabLine} />}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.listWrap} style={{ height: 'calc(100vh - 88rpx)' }}>
        <View className={styles.messageList}>
          {filteredMessages.map(msg => {
            const typeInfo = typeLabelMap[msg.type];
            return (
              <View key={msg.id} className={classnames(styles.messageCard, !msg.read && styles.messageUnread)}>
                <View className={styles.messageHeader}>
                  <Text className={classnames(styles.messageType, typeInfo.style)}>{typeInfo.label}</Text>
                  <Text className={styles.messageTime}>{msg.createdAt}</Text>
                </View>
                <Text className={styles.messageTitle}>{msg.title}</Text>
                <Text className={styles.messageContent}>{msg.content}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default MessagePage;
