import React, { useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const categoryOptions = ['企业征信', '交通出行', '医疗健康', '电商零售', '金融风控', '物流运输', '智慧城市', '农业科技', '教育科研', '环境气象'];
const tagOptions = ['API接口', '实时数据', '脱敏数据', '统计数据', '公开数据', '用户行为', '推荐算法', '风控模型', '信用评分', '遥感数据', 'IoT数据', '轨迹数据'];
const riskOptions: Array<{ value: 'low' | 'medium' | 'high'; label: string }> = [
  { value: 'low', label: '低风险' },
  { value: 'medium', label: '中风险' },
  { value: 'high', label: '高风险' }
];

let idCounter = 100;

const PublishProductPage: React.FC = () => {
  const addProduct = useAppStore(s => s.addProduct);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('次/年');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [sampleAvailable, setSampleAvailable] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    if (!title.trim()) { Taro.showToast({ title: '请输入数据名称', icon: 'none' }); return; }
    if (!description.trim()) { Taro.showToast({ title: '请输入数据简介', icon: 'none' }); return; }
    if (!category) { Taro.showToast({ title: '请选择行业标签', icon: 'none' }); return; }
    if (!price.trim()) { Taro.showToast({ title: '请输入价格', icon: 'none' }); return; }
    if (selectedTags.length === 0) { Taro.showToast({ title: '请至少选择一个标签', icon: 'none' }); return; }

    const id = `custom_p_${++idCounter}`;
    const today = new Date().toISOString().slice(0, 10);
    addProduct({
      id,
      title: title.trim(),
      description: description.trim(),
      category,
      tags: selectedTags,
      price: price.trim(),
      priceUnit,
      provider: '数联科技',
      providerAvatar: 'https://picsum.photos/id/64/200/200',
      coverImage: `https://picsum.photos/id/${(idCounter % 10) + 1}/300/300`,
      updateDate: today,
      viewCount: 0,
      collectCount: 0,
      sampleAvailable,
      riskLevel
    });

    Taro.showToast({ title: '上架成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.container}>
      <View className={styles.formSection}>
        <Text className={styles.formTitle}>基本信息</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>数据名称<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} placeholder="请输入数据产品名称" value={title} onInput={e => setTitle(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>数据简介<Text className={styles.formRequired}>*</Text></Text>
          <Textarea className={styles.formTextarea} placeholder="请描述数据内容、覆盖范围、更新频率等" value={description} onInput={e => setDescription(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>行业标签<Text className={styles.formRequired}>*</Text></Text>
          <View className={styles.tagSelector}>
            {categoryOptions.map(opt => (
              <View key={opt} className={classnames(styles.tagOption, category === opt && styles.tagOptionActive)} onClick={() => setCategory(opt)}>
                <Text className={classnames(styles.tagOptionText, category === opt && styles.tagOptionTextActive)}>{opt}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>关键词标签（多选）<Text className={styles.formRequired}>*</Text></Text>
          <View className={styles.tagSelector}>
            {tagOptions.map(tag => (
              <View key={tag} className={classnames(styles.tagOption, selectedTags.includes(tag) && styles.tagOptionActive)} onClick={() => toggleTag(tag)}>
                <Text className={classnames(styles.tagOptionText, selectedTags.includes(tag) && styles.tagOptionTextActive)}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.formTitle}>价格与风险</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>价格<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} type="digit" placeholder="请输入价格" value={price} onInput={e => setPrice(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>计价单位</Text>
          <Input className={styles.formInput} placeholder="如：次/年、套" value={priceUnit} onInput={e => setPriceUnit(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>风险等级</Text>
          <View className={styles.riskSelector}>
            {riskOptions.map(opt => (
              <View key={opt.value} className={classnames(styles.riskOption, riskLevel === opt.value && styles.riskOptionActive)} onClick={() => setRiskLevel(opt.value)}>
                <Text className={classnames(styles.riskOptionText, riskLevel === opt.value && styles.riskOptionTextActive)}>{opt.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.formItem}>
          <View className={styles.switchRow} onClick={() => setSampleAvailable(!sampleAvailable)}>
            <Text className={styles.switchLabel}>提供样例数据</Text>
            <View className={classnames(styles.switch, sampleAvailable && styles.switchOn)}>
              <View className={classnames(styles.switchDot, sampleAvailable && styles.switchDotOn)} />
            </View>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>提交上架</Text>
        </View>
      </View>
    </View>
  );
};

export default PublishProductPage;
