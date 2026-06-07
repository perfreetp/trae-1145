import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
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

const subtypeLabelMap: Record<string, { label: string; style: string }> = {
  quote: { label: '报价变更', style: styles.subQuote },
  message: { label: '留言', style: styles.subMessage },
  compliance: { label: '合规材料', style: styles.subCompliance },
  delivery: { label: '交付验收', style: styles.subDelivery },
  status: { label: '状态变更', style: styles.subStatus },
  system: { label: '系统', style: styles.subSystem }
};

const MessagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const messages = useAppStore(s => s.messages);
  const markMessageRead = useAppStore(s => s.markMessageRead);

  const filteredMessages = messages.filter(msg => {
    const type = typeFilterMap[activeTab];
    return !type || msg.type === type;
  });

  const handleMessageClick = (msg: typeof messages[0]) => {
    if (!msg.read) {
      markMessageRead(msg.id);
    }
    if (msg.linkUrl) {
      Taro.navigateTo({ url: msg.linkUrl });
    }
  };

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
            const subInfo = subtypeLabelMap[msg.subtype];
            return (
              <View key={msg.id} className={classnames(styles.messageCard, !msg.read && styles.messageUnread)} onClick={() => handleMessageClick(msg)}>
                <View className={styles.messageHeader}>
                  <View className={styles.messageTags}>
                    <Text className={classnames(styles.messageType, typeInfo.style)}>{typeInfo.label}</Text>
                    {subInfo && <Text className={classnames(styles.messageSubtype, subInfo.style)}>{subInfo.label}</Text>}
                  </View>
                  <Text className={styles.messageTime}>{msg.createdAt}</Text>
                </View>
                <Text className={styles.messageTitle}>{msg.title}</Text>
                <Text className={styles.messageContent}>{msg.content}</Text>
                {msg.linkUrl && <Text className={styles.messageLink}>查看详情 ›</Text>}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default MessagePage;
