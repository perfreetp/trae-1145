import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const statusLabels: Record<string, string> = {
  pending: '待确认',
  negotiating: '洽谈中',
  compliance: '合规审核',
  confirmed: '已确认',
  withdrawn: '已撤回'
};

let commIdCounter = 500;
let msgIdCounter = 500;

const IntentionDetailPage: React.FC = () => {
  const router = useRouter();
  const intentionOrders = useAppStore(s => s.intentionOrders);
  const addCommunication = useAppStore(s => s.addCommunication);
  const addMessage = useAppStore(s => s.addMessage);
  const order = intentionOrders.find(o => o.id === router.params.id);

  const [message, setMessage] = useState('');

  if (!order) {
    return (
      <View className={styles.container}>
        <View className={styles.section}>
          <Text style={{ color: '#86909C', textAlign: 'center' }}>未找到该意向单</Text>
        </View>
      </View>
    );
  }

  const statusStyleMap: Record<string, string> = {
    pending: styles.statusPending,
    negotiating: styles.statusNegotiating,
    compliance: styles.statusCompliance,
    confirmed: styles.statusConfirmed,
    withdrawn: styles.statusWithdrawn
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      Taro.showToast({ title: '请输入留言内容', icon: 'none' });
      return;
    }

    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const record = {
      id: `comm_${++commIdCounter}`,
      sender: '我方',
      senderRole: 'supply' as const,
      content: message.trim(),
      createdAt: timeStr
    };

    addCommunication(order.id, record);

    addMessage({
      id: `msg_${++msgIdCounter}`,
      title: '沟通留言已发送',
      content: `您在"${order.productTitle}"的意向沟通中发送了新留言`,
      type: 'transaction',
      read: false,
      createdAt: timeStr,
      linkUrl: `/pages/intentionDetail/index?id=${order.id}`
    });

    setMessage('');
    Taro.showToast({ title: '留言已发送', icon: 'success' });
  };

  const handleViewProgress = () => {
    Taro.navigateTo({ url: `/pages/progress/index?id=${order.id}` });
  };

  const lastComm = order.communications.length > 0
    ? order.communications[order.communications.length - 1]
    : null;

  return (
    <View className={styles.container}>
      <View className={styles.orderHeader}>
        <Text className={styles.orderTitle}>{order.productTitle}</Text>
        <View className={styles.orderMeta}>
          <Text className={classnames(styles.orderTag, order.type === 'supply' ? styles.typeSupply : styles.typeDemand)}>
            {order.type === 'supply' ? '供方意向' : '需方意向'}
          </Text>
          <Text className={classnames(styles.orderTag, statusStyleMap[order.status])}>
            {statusLabels[order.status]}
          </Text>
          <Text className={styles.orderId}>订单号：{order.id}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>基本信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>合作方</Text>
            <Text className={styles.infoValue}>{order.counterparty}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>报价金额</Text>
            <Text className={classnames(styles.infoValue, styles.infoValueHighlight)}>{order.quoteAmount}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>创建时间</Text>
            <Text className={styles.infoValue}>{order.createdAt}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>最近更新</Text>
            <Text className={styles.infoValue}>{order.updatedAt}</Text>
          </View>
          {lastComm && (
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>最近回复</Text>
              <Text className={styles.infoValue}>{lastComm.createdAt}</Text>
            </View>
          )}
        </View>
      </View>

      {order.inquiryInfo && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>询价信息</Text>
          <View className={styles.inquiryCard}>
            <View className={styles.inquiryRow}>
              <Text className={styles.inquiryLabel}>询价公司</Text>
              <Text className={styles.inquiryValue}>{order.inquiryInfo.company}</Text>
            </View>
            <View className={styles.inquiryRow}>
              <Text className={styles.inquiryLabel}>联系人</Text>
              <Text className={styles.inquiryValue}>{order.inquiryInfo.contactName} {order.inquiryInfo.phone}</Text>
            </View>
            <View className={styles.inquiryRow}>
              <Text className={styles.inquiryLabel}>使用目的</Text>
              <Text className={styles.inquiryValue}>{order.inquiryInfo.purpose}</Text>
            </View>
            {order.inquiryInfo.expectedBudget && (
              <View className={styles.inquiryRow}>
                <Text className={styles.inquiryLabel}>期望预算</Text>
                <Text className={styles.inquiryValue}>{order.inquiryInfo.expectedBudget}</Text>
              </View>
            )}
            {order.inquiryInfo.expectedDelivery && (
              <View className={styles.inquiryRow}>
                <Text className={styles.inquiryLabel}>期望交付时间</Text>
                <Text className={styles.inquiryValue}>{order.inquiryInfo.expectedDelivery}</Text>
              </View>
            )}
            {order.inquiryInfo.remark && (
              <View className={styles.inquiryRow}>
                <Text className={styles.inquiryLabel}>备注</Text>
                <Text className={styles.inquiryValue}>{order.inquiryInfo.remark}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>沟通记录</Text>
        <ScrollView scrollY style={{ maxHeight: '600rpx' }}>
          <View className={styles.chatList}>
            {order.communications.map(comm => (
              <View key={comm.id} className={classnames(styles.chatItem, comm.senderRole === 'supply' ? styles.chatItemSupply : styles.chatItemDemand)}>
                <View className={classnames(styles.chatAvatar, comm.senderRole === 'supply' ? styles.avatarSupply : styles.avatarDemand)}>
                  <Text>{comm.sender.slice(0, 1)}</Text>
                </View>
                <View className={classnames(styles.chatBubble, comm.senderRole === 'supply' ? styles.bubbleSupply : styles.bubbleDemand)}>
                  <Text className={classnames(styles.chatSender, comm.senderRole === 'supply' ? styles.senderSupply : styles.senderDemand)}>{comm.sender}</Text>
                  <Text className={classnames(styles.chatContent, comm.senderRole === 'supply' ? styles.contentSupply : styles.contentDemand)}>{comm.content}</Text>
                  <Text className={classnames(styles.chatTime, comm.senderRole === 'supply' ? styles.timeSupply : styles.timeDemand)}>{comm.createdAt}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.progressEntry} onClick={handleViewProgress}>
          <View className={styles.progressEntryLeft}>
            <Text className={styles.progressIcon}>📊</Text>
            <Text className={styles.progressEntryText}>查看交易进度</Text>
          </View>
          <Text className={styles.progressArrow}>›</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Input className={styles.msgInput} placeholder="输入沟通留言..." value={message} onInput={e => setMessage(e.detail.value)} />
        <View className={styles.sendBtn} onClick={handleSendMessage}>
          <Text className={styles.sendBtnText}>发送</Text>
        </View>
      </View>
    </View>
  );
};

export default IntentionDetailPage;
