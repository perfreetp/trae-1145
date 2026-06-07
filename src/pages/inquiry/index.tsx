import React, { useState } from 'react';
import { View, Text, Image, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

let orderCounter = 900;
let msgIdCounter = 700;

const InquiryPage: React.FC = () => {
  const router = useRouter();
  const products = useAppStore(s => s.products);
  const addIntentionOrder = useAppStore(s => s.addIntentionOrder);
  const addMessage = useAppStore(s => s.addMessage);
  const product = products.find(p => p.id === router.params.id) || products[0];
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [expectedBudget, setExpectedBudget] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [remark, setRemark] = useState('');

  const handleSubmit = () => {
    if (!company.trim()) { Taro.showToast({ title: '请输入公司名称', icon: 'none' }); return; }
    if (!contactName.trim()) { Taro.showToast({ title: '请输入联系人', icon: 'none' }); return; }
    if (!phone.trim()) { Taro.showToast({ title: '请输入联系电话', icon: 'none' }); return; }
    if (!purpose.trim()) { Taro.showToast({ title: '请输入使用目的', icon: 'none' }); return; }

    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const timeStr = `${today} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newOrderId = `inquiry_${++orderCounter}`;

    addIntentionOrder({
      id: newOrderId,
      productId: product.id,
      productTitle: product.title,
      type: 'demand',
      status: 'pending',
      createdAt: today,
      updatedAt: today,
      counterparty: company.trim(),
      quoteAmount: product.price ? `¥${product.price}/${product.priceUnit}` : '待报价',
      lastMessage: `${contactName.trim()}发起询价：${purpose.trim().slice(0, 30)}...`,
      communications: [
        {
          id: `comm_init_${orderCounter}`,
          sender: contactName.trim(),
          senderRole: 'demand',
          content: `发起询价：${purpose.trim()}`,
          createdAt: timeStr
        }
      ],
      inquiryInfo: {
        company: company.trim(),
        contactName: contactName.trim(),
        phone: phone.trim(),
        purpose: purpose.trim(),
        remark: remark.trim(),
        expectedBudget: expectedBudget.trim(),
        expectedDelivery: expectedDelivery.trim()
      }
    });

    addMessage({
      id: `msg_${++msgIdCounter}`,
      title: '询价意向单已生成',
      content: `您对"${product.title}"的询价已生成意向单(${newOrderId})，供方将在1-3个工作日内回复。`,
      type: 'transaction',
      read: false,
      createdAt: timeStr,
      linkUrl: `/pages/intentionDetail/index?id=${newOrderId}`
    });

    Taro.showToast({ title: '询价已提交，意向单已生成', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.container}>
      <View className={styles.productInfo}>
        <Image className={styles.productCover} src={product.coverImage} mode="aspectFill" />
        <View className={styles.productDetail}>
          <Text className={styles.productTitle}>{product.title}</Text>
          <View style={{ display: 'flex', alignItems: 'baseline' }}>
            <Text className={styles.productPrice}>¥{product.price}</Text>
            <Text className={styles.productPriceUnit}>/{product.priceUnit}</Text>
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.formTitle}>询价信息</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>公司名称<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} placeholder="请输入公司名称" value={company} onInput={e => setCompany(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>联系人<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} placeholder="请输入联系人姓名" value={contactName} onInput={e => setContactName(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>联系电话<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} type="number" placeholder="请输入联系电话" value={phone} onInput={e => setPhone(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>使用目的<Text className={styles.formRequired}>*</Text></Text>
          <Textarea className={styles.formTextarea} placeholder="请描述数据使用目的和场景" value={purpose} onInput={e => setPurpose(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>期望预算</Text>
          <Input className={styles.formInput} type="digit" placeholder="请输入期望预算金额（选填）" value={expectedBudget} onInput={e => setExpectedBudget(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>期望交付时间</Text>
          <Input className={styles.formInput} placeholder="如：2026-08-01（选填）" value={expectedDelivery} onInput={e => setExpectedDelivery(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>备注说明</Text>
          <Textarea className={styles.formTextarea} placeholder="其他需要说明的事项（选填）" value={remark} onInput={e => setRemark(e.detail.value)} />
        </View>
      </View>

      <View className={styles.tips}>
        <Text className={styles.tipsTitle}>📋 询价须知</Text>
        <Text className={styles.tipsText}>
          提交询价后将自动生成意向单，供方将在1-3个工作日内回复。请确保信息真实有效，授权范围与使用场景一致。
        </Text>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>提交询价</Text>
        </View>
      </View>
    </View>
  );
};

export default InquiryPage;
