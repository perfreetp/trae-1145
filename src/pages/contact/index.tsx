import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const contacts = [
  { id: 'c1', name: '李明辉', company: '金信评估', role: '数据采购经理', avatar: 'https://picsum.photos/id/64/200/200', phone: '138****5678' },
  { id: 'c2', name: '王思远', company: '智途科技', role: '技术总监', avatar: 'https://picsum.photos/id/91/200/200', phone: '139****1234' },
  { id: 'c3', name: '赵雪晴', company: '医数智能', role: '产品经理', avatar: 'https://picsum.photos/id/177/200/200', phone: '137****9876' },
  { id: 'c4', name: '陈志强', company: '银盾金科', role: '风控总监', avatar: 'https://picsum.photos/id/338/200/200', phone: '136****5432' },
  { id: 'c5', name: '刘雅婷', company: '商云网络', role: '运营主管', avatar: 'https://picsum.photos/id/1027/200/200', phone: '135****6789' }
];

const ContactPage: React.FC = () => {
  const handleCall = (phone: string) => {
    Taro.makePhoneCall({ phoneNumber: phone.replace(/\*/g, '0') });
  };

  const handleAdd = () => {
    Taro.showToast({ title: '添加联系人功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.contactList}>
          {contacts.map(contact => (
            <View key={contact.id} className={styles.contactCard}>
              <Image className={styles.contactAvatar} src={contact.avatar} mode="aspectFill" />
              <View className={styles.contactInfo}>
                <Text className={styles.contactName}>{contact.name}</Text>
                <Text className={styles.contactCompany}>{contact.company}</Text>
                <Text className={styles.contactRole}>{contact.role}</Text>
              </View>
              <View className={styles.contactActions}>
                <View className={styles.actionIcon} onClick={() => handleCall(contact.phone)}>
                  <Text>📞</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.addBtn} onClick={handleAdd}>
        <Text className={styles.addIcon}>➕</Text>
        <Text className={styles.addText}>添加</Text>
      </View>
    </View>
  );
};

export default ContactPage;
