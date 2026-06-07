import React, { useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

let orderCounter = 1000;
let msgIdCounter = 800;
let commIdCounter = 600;

const QuoteDemandPage: React.FC = () => {
  const router = useRouter();
  const demands = useAppStore(s => s.demands);
  const addIntentionOrder = useAppStore(s => s.addIntentionOrder);
  const addMessage = useAppStore(s => s.addMessage);
  const demand = demands.find(d => d.id === router.params.id);

  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteUnit, setQuoteUnit] = useState('元/年');
  const [deliveryCycle, setDeliveryCycle] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [dataDesc, setDataDesc] = useState('');

  if (!demand) {
    return (
      <View className={styles.container}>
        <View className={styles.formSection}>
          <Text style={{ color: '#86909C', textAlign: 'center' }}>未找到该采购需求</Text>
        </View>
      </View>
    );
  }

  const handleSubmit = () => {
    if (!quoteAmount.trim()) { Taro.showToast({ title: '请输入报价金额', icon: 'none' }); return; }
    if (!deliveryCycle.trim()) { Taro.showToast({ title: '请输入交付周期', icon: 'none' }); return; }
    if (!contactName.trim()) { Taro.showToast({ title: '请输入联系人', icon: 'none' }); return; }
    if (!contactPhone.trim()) { Taro.showToast({ title: '请输入联系电话', icon: 'none' }); return; }
    if (!dataDesc.trim()) { Taro.showToast({ title: '请填写数据说明', icon: 'none' }); return; }

    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const timeStr = `${today} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newOrderId = `quote_${++orderCounter}`;
    const quoteStr = `¥${quoteAmount.trim()}${quoteUnit}`;

    addIntentionOrder({
      id: newOrderId,
      productId: '',
      productTitle: demand.title,
      demandId: demand.id,
      demandTitle: demand.title,
      type: 'demand',
      status: 'pending',
      createdAt: today,
      updatedAt: today,
      counterparty: demand.demander,
      quoteAmount: quoteStr,
      quoteModified: false,
      lastMessage: `供方报价 ${quoteStr}，交付周期 ${deliveryCycle.trim()}`,
      communications: [
        {
          id: `comm_${++commIdCounter}`,
          sender: contactName.trim(),
          senderRole: 'supply',
          type: 'quote',
          content: `供方报价：${quoteStr}，交付周期：${deliveryCycle.trim()}。${dataDesc.trim()}`,
          createdAt: timeStr
        }
      ]
    });

    addMessage({
      id: `msg_${++msgIdCounter}`,
      title: '报价已提交',
      content: `您对"${demand.title}"的报价已生成意向单(${newOrderId})，等待需方确认。`,
      type: 'transaction',
      read: false,
      createdAt: timeStr,
      linkUrl: `/pages/intentionDetail/index?id=${newOrderId}`
    });

    Taro.showToast({ title: '报价已提交', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.container}>
      <View className={styles.demandInfo}>
        <Text className={styles.demandTitle}>{demand.title}</Text>
        <View className={styles.demandMeta}>
          <Text className={styles.demandBudget}>
            <Text className={styles.demandBudgetLabel}>预算 </Text>¥{demand.budget}/{demand.budgetUnit}
          </Text>
        </View>
        <Text className={styles.demandDemander}>需方：{demand.demander} {demand.demanderPhone && `| ${demand.demanderPhone}`}</Text>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.formTitle}>供方报价</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>报价金额<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} type="digit" placeholder="请输入报价金额" value={quoteAmount} onInput={e => setQuoteAmount(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>计价单位</Text>
          <Input className={styles.formInput} placeholder="如：元/年" value={quoteUnit} onInput={e => setQuoteUnit(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>交付周期<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} placeholder="如：签订合同后7个工作日" value={deliveryCycle} onInput={e => setDeliveryCycle(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>联系人<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} placeholder="请输入联系人姓名" value={contactName} onInput={e => setContactName(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>联系电话<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} type="number" placeholder="请输入联系电话" value={contactPhone} onInput={e => setContactPhone(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>可提供数据说明<Text className={styles.formRequired}>*</Text></Text>
          <Textarea className={styles.formTextarea} placeholder="请描述可提供的数据内容、格式、覆盖范围等" value={dataDesc} onInput={e => setDataDesc(e.detail.value)} />
        </View>
      </View>

      <View className={styles.tips}>
        <Text className={styles.tipsTitle}>📋 报价须知</Text>
        <Text className={styles.tipsText}>
          提交报价后将自动生成意向单，需方确认后可进入后续沟通。报价仅可修改一次，请合理定价。
        </Text>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>提交报价</Text>
        </View>
      </View>
    </View>
  );
};

export default QuoteDemandPage;
