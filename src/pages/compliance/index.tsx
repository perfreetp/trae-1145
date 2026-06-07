import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface UploadItem {
  label: string;
  status: 'done' | 'pending' | 'missing';
}

interface AuthItem {
  label: string;
  desc: string;
  checked: boolean;
}

const CompliancePage: React.FC = () => {
  const [uploads] = useState<UploadItem[]>([
    { label: '数据来源合规证明', status: 'done' },
    { label: '数据脱敏处理报告', status: 'done' },
    { label: '安全评估报告', status: 'pending' },
    { label: '数据交易协议模板', status: 'missing' },
    { label: '个人信息保护影响评估', status: 'missing' }
  ]);

  const [authItems, setAuthItems] = useState<AuthItem[]>([
    { label: '内部研究使用', desc: '仅限企业内部研究分析', checked: true },
    { label: '商业产品集成', desc: '将数据集成到商业产品中', checked: true },
    { label: '数据再加工', desc: '对数据进行二次加工处理', checked: false },
    { label: '对外提供', desc: '向第三方提供数据或分析结果', checked: false },
    { label: '跨境传输', desc: '数据跨境传输到境外', checked: false }
  ]);

  const toggleAuth = (index: number) => {
    setAuthItems(prev => prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item));
  };

  const handleSubmit = () => {
    const missing = uploads.filter(u => u.status === 'missing').length;
    if (missing > 0) {
      Taro.showToast({ title: `还有${missing}项材料未上传`, icon: 'none' });
      return;
    }
    const checked = authItems.filter(a => a.checked).length;
    if (checked === 0) {
      Taro.showToast({ title: '请至少选择一项授权范围', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '合规材料已提交审核', icon: 'success' });
  };

  const statusLabelMap: Record<string, string> = {
    done: '已上传',
    pending: '审核中',
    missing: '未上传'
  };

  const statusStyleMap: Record<string, string> = {
    done: styles.uploadDone,
    pending: styles.uploadPending,
    missing: styles.uploadMissing
  };

  return (
    <View className={styles.container}>
      <View className={styles.alertCard}>
        <Text className={styles.alertIcon}>⚠️</Text>
        <View className={styles.alertContent}>
          <Text className={styles.alertTitle}>合规提醒</Text>
          <Text className={styles.alertDesc}>
            请确保所有材料真实有效，授权范围与实际使用场景一致。虚假材料将导致交易终止并可能承担法律责任。
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>材料上传</Text>
        {uploads.map((item, index) => (
          <View key={index} className={styles.uploadItem}>
            <Text className={styles.uploadLabel}>{item.label}</Text>
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <Text className={`${styles.uploadStatus} ${statusStyleMap[item.status]}`}>
                {statusLabelMap[item.status]}
              </Text>
              {item.status === 'missing' && <Text className={styles.uploadBtn}>上传</Text>}
            </View>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>授权范围</Text>
        {authItems.map((item, index) => (
          <View key={index} className={styles.authItem} onClick={() => toggleAuth(index)}>
            <View className={`${styles.checkbox} ${item.checked ? styles.checkboxChecked : ''}`}>
              {item.checked && <Text className={styles.checkboxText}>✓</Text>}
            </View>
            <View>
              <Text className={styles.authLabel}>{item.label}</Text>
              <Text className={styles.authDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.sampleCard}>
        <View className={styles.sampleHeader}>
          <Text className={styles.sampleTitle}>样例数据预览</Text>
          <Text className={styles.sampleBtn}>查看更多</Text>
        </View>
        <View className={styles.samplePreview}>
          <View className={styles.sampleRow}>
            <Text className={styles.sampleField}>企业名称</Text>
            <Text className={styles.sampleValue}>北京某某科技有限公司</Text>
          </View>
          <View className={styles.sampleRow}>
            <Text className={styles.sampleField}>注册资本</Text>
            <Text className={styles.sampleValue}>500万元</Text>
          </View>
          <View className={styles.sampleRow}>
            <Text className={styles.sampleField}>成立日期</Text>
            <Text className={styles.sampleValue}>2020-03-15</Text>
          </View>
          <View className={styles.sampleRow}>
            <Text className={styles.sampleField}>经营范围</Text>
            <Text className={styles.sampleValue}>技术开发、技术咨询...</Text>
          </View>
        </View>
      </View>

      <View className={styles.submitBtn} onClick={handleSubmit}>
        <Text className={styles.submitBtnText}>提交审核</Text>
      </View>
    </View>
  );
};

export default CompliancePage;
