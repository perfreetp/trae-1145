import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const statusLabels: Record<string, string> = {
  pending: '待确认', negotiating: '洽谈中', compliance: '合规审核',
  confirmed: '已确认', delivering: '交付中', completed: '已完成', withdrawn: '已撤回'
};

const typeLabels: Record<string, { label: string; style: string }> = {
  inquiry: { label: '询价', style: styles.typeTagInquiry },
  message: { label: '留言', style: styles.typeTagMessage },
  quote: { label: '报价', style: styles.typeTagQuote },
  status: { label: '状态', style: styles.typeTagStatus }
};

const acceptanceLabels: Record<string, string> = { pending: '待验收', accepted: '已验收', rejected: '已驳回' };

let commIdCounter = 500;
let msgIdCounter = 500;

const IntentionDetailPage: React.FC = () => {
  const router = useRouter();
  const intentionOrders = useAppStore(s => s.intentionOrders);
  const demands = useAppStore(s => s.demands);
  const addCommunication = useAppStore(s => s.addCommunication);
  const updateQuote = useAppStore(s => s.updateQuote);
  const addMessage = useAppStore(s => s.addMessage);
  const uploadComplianceMaterial = useAppStore(s => s.uploadComplianceMaterial);
  const submitCompliance = useAppStore(s => s.submitCompliance);
  const updateOrderStatus = useAppStore(s => s.updateOrderStatus);
  const updateDelivery = useAppStore(s => s.updateDelivery);
  const markMessagesReadByOrder = useAppStore(s => s.markMessagesReadByOrder);
  const order = intentionOrders.find(o => o.id === router.params.id);

  const [message, setMessage] = useState('');
  const [editQuoteVisible, setEditQuoteVisible] = useState(false);
  const [newQuote, setNewQuote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  React.useEffect(() => {
    if (order) markMessagesReadByOrder(order.id);
  }, [order?.id]);

  if (!order) {
    return (<View className={styles.container}><View className={styles.section}><Text style={{ color: '#86909C', textAlign: 'center' }}>未找到该意向单</Text></View></View>);
  }

  const statusStyleMap: Record<string, string> = {
    pending: styles.statusPending, negotiating: styles.statusNegotiating, compliance: styles.statusCompliance,
    confirmed: styles.statusConfirmed, delivering: styles.statusDelivering, completed: styles.statusCompleted, withdrawn: styles.statusWithdrawn
  };

  const demand = order.demandId ? demands.find(d => d.id === order.demandId) : null;

  const handleSendMessage = () => {
    if (!message.trim()) { Taro.showToast({ title: '请输入留言内容', icon: 'none' }); return; }
    const timeStr = `${new Date().toISOString().slice(0, 10)} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    addCommunication(order.id, { id: `comm_${++commIdCounter}`, sender: '我方', senderRole: 'supply', type: 'message', content: message.trim(), createdAt: timeStr });
    addMessage({ id: `msg_${++msgIdCounter}`, title: '沟通留言已发送', content: `您在"${order.productTitle}"的意向沟通中发送了新留言`, type: 'transaction', subtype: 'message', read: false, createdAt: timeStr, linkUrl: `/pages/intentionDetail/index?id=${order.id}`, orderId: order.id });
    setMessage('');
    Taro.showToast({ title: '留言已发送', icon: 'success' });
  };

  const handleSubmitQuote = () => {
    if (!newQuote.trim()) { Taro.showToast({ title: '请输入新报价', icon: 'none' }); return; }
    const timeStr = `${new Date().toISOString().slice(0, 10)} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    const record = { id: `comm_${++commIdCounter}`, sender: '我方', senderRole: 'supply' as const, type: 'quote' as const, content: `报价修改为：${newQuote.trim()}`, createdAt: timeStr };
    updateQuote(order.id, newQuote.trim(), record);
    addMessage({ id: `msg_${++msgIdCounter}`, title: '报价变更提醒', content: `"${order.productTitle}"的报价已修改为${newQuote.trim()}，请查看确认。`, type: 'transaction', subtype: 'quote', read: false, createdAt: timeStr, linkUrl: `/pages/intentionDetail/index?id=${order.id}`, orderId: order.id });
    setEditQuoteVisible(false); setNewQuote('');
    Taro.showToast({ title: '报价已修改', icon: 'success' });
  };

  const handleUploadMaterial = (index: number) => {
    Taro.showActionSheet({
      itemList: ['选择文件上传', '拍照上传'],
      success: () => {
        Taro.showLoading({ title: '上传中...' });
        setTimeout(() => {
          Taro.hideLoading();
          uploadComplianceMaterial(order.id, index);
          Taro.showToast({ title: '上传成功', icon: 'success' });
        }, 800);
      }
    });
  };

  const handleSubmitCompliance = () => {
    const missing = order.complianceMaterials.filter(m => m.status === 'missing').length;
    if (missing > 0) { Taro.showToast({ title: `还有${missing}项材料未上传`, icon: 'none' }); return; }
    submitCompliance(order.id);
    addMessage({ id: `msg_${++msgIdCounter}`, title: '合规材料已提交', content: `"${order.productTitle}"的合规材料已提交审核，预计1-3个工作日完成。`, type: 'progress', subtype: 'compliance', read: false, createdAt: new Date().toISOString().slice(0, 10), linkUrl: `/pages/intentionDetail/index?id=${order.id}`, orderId: order.id });
    Taro.showToast({ title: '合规材料已提交审核', icon: 'success' });
  };

  const handleSubmitDelivery = () => {
    if (!deliveryMethod.trim()) { Taro.showToast({ title: '请填写交付方式', icon: 'none' }); return; }
    if (!deliveryTime.trim()) { Taro.showToast({ title: '请填写交付时间', icon: 'none' }); return; }
    updateDelivery(order.id, { method: deliveryMethod.trim(), deliveryTime: deliveryTime.trim(), acceptanceStatus: 'pending', acceptanceTime: '' });
    updateOrderStatus(order.id, 'delivering', '数据已交付，等待需方验收');
    addMessage({ id: `msg_${++msgIdCounter}`, title: '数据已交付', content: `"${order.productTitle}"数据已交付，等待需方验收确认。`, type: 'transaction', subtype: 'delivery', read: false, createdAt: new Date().toISOString().slice(0, 10), linkUrl: `/pages/intentionDetail/index?id=${order.id}`, orderId: order.id });
    Taro.showToast({ title: '交付信息已提交', icon: 'success' });
  };

  const handleAccept = () => {
    updateDelivery(order.id, { ...order.delivery!, acceptanceStatus: 'accepted', acceptanceTime: new Date().toISOString().slice(0, 10) });
    updateOrderStatus(order.id, 'completed', '交易已完成，数据已验收');
    addMessage({ id: `msg_${++msgIdCounter}`, title: '验收通过', content: `"${order.productTitle}"数据验收通过，交易完成。`, type: 'transaction', subtype: 'delivery', read: false, createdAt: new Date().toISOString().slice(0, 10), linkUrl: `/pages/intentionDetail/index?id=${order.id}`, orderId: order.id });
    Taro.showToast({ title: '验收通过', icon: 'success' });
  };

  const handleViewProgress = () => { Taro.navigateTo({ url: `/pages/progress/index?id=${order.id}` }); };
  const lastComm = order.communications.length > 0 ? order.communications[order.communications.length - 1] : null;

  return (
    <View className={styles.container}>
      <View className={styles.orderHeader}>
        <Text className={styles.orderTitle}>{order.productTitle}</Text>
        <View className={styles.orderMeta}>
          <Text className={classnames(styles.orderTag, order.type === 'supply' ? styles.typeSupply : styles.typeDemand)}>{order.type === 'supply' ? '供方意向' : '需方意向'}</Text>
          <Text className={classnames(styles.orderTag, statusStyleMap[order.status])}>{statusLabels[order.status]}</Text>
          <Text className={styles.orderId}>订单号：{order.id}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>基本信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}><Text className={styles.infoLabel}>合作方</Text><Text className={styles.infoValue}>{order.counterparty}</Text></View>
          <View className={styles.infoItem}><Text className={styles.infoLabel}>报价金额</Text><Text className={classnames(styles.infoValue, styles.infoValueHighlight)}>{order.quoteAmount}</Text></View>
          {!order.quoteModified && order.status !== 'withdrawn' && order.status !== 'completed' && (
            <View className={styles.infoItem}><Text className={styles.editQuoteBtn} onClick={() => setEditQuoteVisible(true)}>修改报价</Text></View>
          )}
          {order.quoteModified && <View className={styles.infoItem}><Text className={styles.quoteModifiedTag}>已修改</Text></View>}
          <View className={styles.infoItem}><Text className={styles.infoLabel}>创建时间</Text><Text className={styles.infoValue}>{order.createdAt}</Text></View>
          <View className={styles.infoItem}><Text className={styles.infoLabel}>最近更新</Text><Text className={styles.infoValue}>{order.updatedAt}</Text></View>
          {lastComm && <View className={styles.infoItem}><Text className={styles.infoLabel}>最近回复</Text><Text className={styles.infoValue}>{lastComm.createdAt}</Text></View>}
        </View>
        {editQuoteVisible && (
          <View className={styles.editQuoteBox}>
            <Input className={styles.editQuoteInput} placeholder="输入新报价，如 ¥60,000/年" value={newQuote} onInput={e => setNewQuote(e.detail.value)} />
            <View className={styles.editQuoteActions}>
              <View className={styles.editQuoteCancel} onClick={() => { setEditQuoteVisible(false); setNewQuote(''); }}><Text className={styles.editQuoteCancelText}>取消</Text></View>
              <View className={styles.editQuoteConfirm} onClick={handleSubmitQuote}><Text className={styles.editQuoteConfirmText}>确认修改</Text></View>
            </View>
          </View>
        )}
      </View>

      {demand && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>采购需求信息</Text>
          <View className={styles.inquiryCard}>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>需求标题</Text><Text className={styles.inquiryValue}>{demand.title}</Text></View>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>预算</Text><Text className={styles.inquiryValue}>¥{demand.budget}/{demand.budgetUnit}</Text></View>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>截止时间</Text><Text className={styles.inquiryValue}>{demand.deadline}</Text></View>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>需方联系人</Text><Text className={styles.inquiryValue}>{demand.demander} {demand.demanderPhone}</Text></View>
          </View>
        </View>
      )}

      {order.supplyInfo && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>供方信息</Text>
          <View className={styles.inquiryCard}>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>联系人</Text><Text className={styles.inquiryValue}>{order.supplyInfo.contactName} {order.supplyInfo.phone}</Text></View>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>交付周期</Text><Text className={styles.inquiryValue}>{order.supplyInfo.deliveryCycle}</Text></View>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>数据说明</Text><Text className={styles.inquiryValue}>{order.supplyInfo.dataDesc}</Text></View>
          </View>
        </View>
      )}

      {order.inquiryInfo && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>询价信息</Text>
          <View className={styles.inquiryCard}>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>询价公司</Text><Text className={styles.inquiryValue}>{order.inquiryInfo.company}</Text></View>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>联系人</Text><Text className={styles.inquiryValue}>{order.inquiryInfo.contactName} {order.inquiryInfo.phone}</Text></View>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>使用目的</Text><Text className={styles.inquiryValue}>{order.inquiryInfo.purpose}</Text></View>
            {order.inquiryInfo.expectedBudget && <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>期望预算</Text><Text className={styles.inquiryValue}>{order.inquiryInfo.expectedBudget}</Text></View>}
            {order.inquiryInfo.expectedDelivery && <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>期望交付时间</Text><Text className={styles.inquiryValue}>{order.inquiryInfo.expectedDelivery}</Text></View>}
          </View>
        </View>
      )}

      {(order.status === 'compliance' || order.status === 'negotiating') && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>合规材料</Text>
          {order.complianceMaterials.map((mat, idx) => (
            <View key={idx} className={styles.materialItem}>
              <Text className={styles.materialLabel}>{mat.label}</Text>
              <View className={styles.materialRight}>
                <Text className={classnames(styles.materialStatus, mat.status === 'done' ? styles.matDone : mat.status === 'pending' ? styles.matPending : styles.matMissing)}>
                  {mat.status === 'done' ? '已上传' : mat.status === 'pending' ? '审核中' : '未上传'}
                </Text>
                {mat.status === 'missing' && !order.complianceSubmitted && (
                  <Text className={styles.materialUploadBtn} onClick={() => handleUploadMaterial(idx)}>上传</Text>
                )}
              </View>
            </View>
          ))}
          {!order.complianceSubmitted && (
            <View className={styles.submitComplianceBtn} onClick={handleSubmitCompliance}>
              <Text className={styles.submitComplianceBtnText}>提交合规审核</Text>
            </View>
          )}
          {order.complianceSubmitted && <Text className={styles.complianceSubmittedText}>材料已提交审核中</Text>}
        </View>
      )}

      {(order.status === 'confirmed' && !order.delivery) && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>交付信息</Text>
          <View className={styles.editQuoteBox}>
            <View className={styles.formItem}><Text className={styles.formLabel}>交付方式</Text><Input className={styles.editQuoteInput} placeholder="如：API接口、文件传输" value={deliveryMethod} onInput={e => setDeliveryMethod(e.detail.value)} /></View>
            <View className={styles.formItem} style={{ marginTop: '16rpx' }}><Text className={styles.formLabel}>交付时间</Text><Input className={styles.editQuoteInput} placeholder="如：2026-06-15" value={deliveryTime} onInput={e => setDeliveryTime(e.detail.value)} /></View>
            <View className={styles.editQuoteActions} style={{ marginTop: '16rpx' }}>
              <View className={styles.editQuoteConfirm} style={{ flex: 1 }} onClick={handleSubmitDelivery}><Text className={styles.editQuoteConfirmText}>提交交付</Text></View>
            </View>
          </View>
        </View>
      )}

      {order.delivery && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>交付跟踪</Text>
          <View className={styles.inquiryCard}>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>交付方式</Text><Text className={styles.inquiryValue}>{order.delivery.method}</Text></View>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>交付时间</Text><Text className={styles.inquiryValue}>{order.delivery.deliveryTime}</Text></View>
            <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>验收状态</Text><Text className={classnames(styles.inquiryValue, order.delivery.acceptanceStatus === 'accepted' ? styles.matDone : styles.matPending)}>{acceptanceLabels[order.delivery.acceptanceStatus]}</Text></View>
            {order.delivery.acceptanceTime && <View className={styles.inquiryRow}><Text className={styles.inquiryLabel}>验收时间</Text><Text className={styles.inquiryValue}>{order.delivery.acceptanceTime}</Text></View>}
          </View>
          {order.delivery.acceptanceStatus === 'pending' && order.status === 'delivering' && (
            <View className={styles.editQuoteActions} style={{ marginTop: '16rpx' }}>
              <View className={styles.editQuoteConfirm} style={{ flex: 1 }} onClick={handleAccept}><Text className={styles.editQuoteConfirmText}>确认验收</Text></View>
            </View>
          )}
          {order.status === 'completed' && (
            <View className={styles.editQuoteActions} style={{ marginTop: '16rpx' }}>
              <View className={classnames(styles.editQuoteConfirm, styles.goEvalBtn)} style={{ flex: 1 }} onClick={() => Taro.navigateTo({ url: '/pages/evaluation/index' })}><Text className={styles.editQuoteConfirmText}>去评价</Text></View>
            </View>
          )}
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>沟通记录</Text>
        <ScrollView scrollY style={{ maxHeight: '600rpx' }}>
          <View className={styles.chatList}>
            {order.communications.map(comm => {
              const typeInfo = typeLabels[comm.type];
              return (
                <View key={comm.id} className={classnames(styles.chatItem, comm.senderRole === 'supply' ? styles.chatItemSupply : styles.chatItemDemand)}>
                  <View className={classnames(styles.chatAvatar, comm.senderRole === 'supply' ? styles.avatarSupply : styles.avatarDemand)}><Text>{comm.sender.slice(0, 1)}</Text></View>
                  <View className={classnames(styles.chatBubble, comm.senderRole === 'supply' ? styles.bubbleSupply : styles.bubbleDemand)}>
                    <View className={styles.chatBubbleHeader}>
                      <Text className={classnames(styles.chatSender, comm.senderRole === 'supply' ? styles.senderSupply : styles.senderDemand)}>{comm.sender}</Text>
                      <Text className={classnames(styles.typeTag, typeInfo.style)}>{typeInfo.label}</Text>
                    </View>
                    <Text className={classnames(styles.chatContent, comm.senderRole === 'supply' ? styles.contentSupply : styles.contentDemand)}>{comm.content}</Text>
                    <Text className={classnames(styles.chatTime, comm.senderRole === 'supply' ? styles.timeSupply : styles.timeDemand)}>{comm.createdAt}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.progressEntry} onClick={handleViewProgress}>
          <View className={styles.progressEntryLeft}><Text className={styles.progressIcon}>📊</Text><Text className={styles.progressEntryText}>查看交易进度</Text></View>
          <Text className={styles.progressArrow}>›</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Input className={styles.msgInput} placeholder="输入沟通留言..." value={message} onInput={e => setMessage(e.detail.value)} />
        <View className={styles.sendBtn} onClick={handleSendMessage}><Text className={styles.sendBtnText}>发送</Text></View>
      </View>
    </View>
  );
};

export default IntentionDetailPage;
