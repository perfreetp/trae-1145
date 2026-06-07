import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TagFilterProps {
  tags: string[];
  selected?: string;
  onChange?: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selected, onChange }) => {
  return (
    <ScrollView scrollX className={styles.container} enhanced showScrollbar={false}>
      <View className={styles.inner}>
        {tags.map(tag => (
          <View
            key={tag}
            className={classnames(styles.tag, selected === tag && styles.tagActive)}
            onClick={() => onChange?.(tag)}
          >
            <Text className={classnames(styles.tagText, selected === tag && styles.tagTextActive)}>{tag}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TagFilter;
