import React, { useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const categoryOptions = ['企业征信', '交通出行', '医疗健康', '金融风控', '电商零售', '工业制造', '新能源', '农业科技', '教育科研'];
const tagOptions = ['信用评分', '企业数据', '全国覆盖', '实时数据', '交通', 'API接口', '医疗影像', '标注数据', 'AI训练', '反欺诈', '金融数据', '风控模型', '用户画像', '脱敏数据', '电商运营', 'IoT数据', '工业数据', '预测维护', '充电桩', '运营数据', '气象数据', '精准预报', '学习行为', '教育数据'];
const budgetUnitOptions = ['元/年', '元/套', '元/次'];

let idCounter = 200;

const PublishDemandPage: React.FC = () => {
  const addDemand = useAppStore(s => s.addDemand);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [budgetUnit, setBudgetUnit] = useState('元/年');
  const [deadline, setDeadline] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    if (!title.trim()) { Taro.showToast({ title: '请输入需求标题', icon: 'none' }); return; }
    if (!description.trim()) { Taro.showToast({ title: '请输入需求描述', icon: 'none' }); return; }
    if (!category) { Taro.showToast({ title: '请选择行业分类', icon: 'none' }); return; }
    if (!budget.trim()) { Taro.showToast({ title: '请输入预算金额', icon: 'none' }); return; }
    if (!deadline.trim()) { Taro.showToast({ title: '请输入截止日期', icon: 'none' }); return; }
    if (!contactName.trim()) { Taro.showToast({ title: '请输入联系人', icon: 'none' }); return; }
    if (!contactPhone.trim()) { Taro.showToast({ title: '请输入联系电话', icon: 'none' }); return; }
    if (selectedTags.length === 0) { Taro.showToast({ title: '请至少选择一个标签', icon: 'none' }); return; }

    const id = `custom_d_${++idCounter}`;
    const today = new Date().toISOString().slice(0, 10);
    addDemand({
      id,
      title: title.trim(),
      description: description.trim(),
      category,
      tags: selectedTags,
      budget: budget.trim(),
      budgetUnit,
      demander: contactName.trim(),
      demanderAvatar: 'https://picsum.photos/id/64/200/200',
      demanderPhone: contactPhone.trim(),
      publishDate: today,
      deadline: deadline.trim(),
      responseCount: 0,
      status: 'open'
    });

    Taro.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.container}>
      <View className={styles.formSection}>
        <Text className={styles.formTitle}>需求信息</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>需求标题<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} placeholder="请输入采购需求标题" value={title} onInput={e => setTitle(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>需求描述<Text className={styles.formRequired}>*</Text></Text>
          <Textarea className={styles.formTextarea} placeholder="请描述您需要的数据内容、用途和具体要求" value={description} onInput={e => setDescription(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>行业分类<Text className={styles.formRequired}>*</Text></Text>
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
        <Text className={styles.formTitle}>预算与时间</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>预算金额<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} type="digit" placeholder="请输入预算金额" value={budget} onInput={e => setBudget(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>计价单位</Text>
          <View className={styles.tagSelector}>
            {budgetUnitOptions.map(opt => (
              <View key={opt} className={classnames(styles.tagOption, budgetUnit === opt && styles.tagOptionActive)} onClick={() => setBudgetUnit(opt)}>
                <Text className={classnames(styles.tagOptionText, budgetUnit === opt && styles.tagOptionTextActive)}>{opt}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>截止日期<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} placeholder="如：2026-09-30" value={deadline} onInput={e => setDeadline(e.detail.value)} />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.formTitle}>联系方式</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>联系人<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} placeholder="请输入联系人姓名" value={contactName} onInput={e => setContactName(e.detail.value)} />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>联系电话<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} type="number" placeholder="请输入联系电话" value={contactPhone} onInput={e => setContactPhone(e.detail.value)} />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>发布需求</Text>
        </View>
      </View>
    </View>
  );
};

export default PublishDemandPage;
