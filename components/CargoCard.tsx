import {Button, Icon} from '@rneui/themed';
import React, {useEffect, useMemo, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import {Cargo} from '../models/Cargo';
import {colorStyle, fontStyle} from '../styles';

interface CargoCardProps {
  item: Pick<
    Cargo,
    | '_id'
    | 'name'
    | 'category'
    | 'brand'
    | 'description'
    | 'ctime'
    | 'utime'
    | 'unit'
    | 'models'
    | 'price'
  >;
  handleEdit: (cargoId: BSON.ObjectId) => void;
  handleDelete: (cargoId: BSON.ObjectId) => void;
}

const CargoCard: React.FC<CargoCardProps> = ({
  item,
  handleEdit,
  handleDelete,
}) => {
  const modelsCount = item.models.length;
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandHeight] = useState(new Animated.Value(0));

  const cardHeight = useMemo(() => {
    const baseHeight = 100;
    const descriptionHeight = item.description ? 25 : 0;
    const unitHeight = item.unit ? 25 : 0;
    const priceHeight = item.price ? 25 : 0;
    const brandHeight = item.brand ? 25 : 0;
    return (
      baseHeight + descriptionHeight + unitHeight + priceHeight + brandHeight
    );
  }, [item.description, item.unit, item.price]);

  // 扩展状态发生变化时触发动画
  const toggleExpand = () => {
    Animated.timing(expandHeight, {
      toValue: isExpanded ? 0 : cardHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    if (isExpanded) {
      Animated.timing(expandHeight, {
        toValue: cardHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [cardHeight, isExpanded]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Button
            type="clear"
            icon={{
              name: isExpanded ? 'caret-down' : 'caret-right',
              size: 18,
              type: 'font-awesome-5',
              color: colorStyle.primary,
            }}
            onPress={toggleExpand}
          />
        </View>
        <Text style={styles.cardCategory}>{item.category?.name}</Text>
      </View>

      <Animated.View style={[styles.cardBody, {height: expandHeight}]}>
        <View style={styles.infoRow}>
          <Icon
            name="boxes"
            size={15}
            color={colorStyle.primary}
            style={styles.icon}
            type="font-awesome-5"
          />
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>规格数目:</Text> {modelsCount} 种
          </Text>
        </View>

        {item.price && (
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>价格:</Text> {item.price} 元
          </Text>
        )}
        {item.brand && (
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>品牌:</Text> {item.brand.name}
          </Text>
        )}
        {item.unit && (
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>单位:</Text> {item.unit.name}
          </Text>
        )}
        {item.description && (
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>备注:</Text> {item.description}
          </Text>
        )}
        <Text style={styles.cardText}>
          <Text style={styles.boldText}>创建时间:</Text>{' '}
          {item.ctime ? new Date(item.ctime).toLocaleString() : '错误!'}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.boldText}>最近修改:</Text>{' '}
          {item.utime ? new Date(item.utime).toLocaleString() : '无出库记录'}
        </Text>
      </Animated.View>

      {/* 只在未展开时显示剩余库存 */}
      <View style={styles.cardFooter}>
        <Text
          style={[
            styles.cardText,
            {display: isExpanded ? 'none' : 'flex', flex: 1},
          ]}>
          {isExpanded ? null : (
            <Icon
              name="boxes"
              size={15}
              color={colorStyle.primary}
              style={styles.icon}
              type="font-awesome-5"
            />
          )}
          <Text style={styles.boldText}>规格数目:</Text> {modelsCount} 种
        </Text>

        {/* 保持按钮位置固定 */}
        <View style={styles.toolBar}>
          <Button
            icon={{
              name: 'edit',
              size: 14,
              color: '#fff',
              type: 'antdesign',
            }}
            buttonStyle={{
              backgroundColor: colorStyle.primary,
              borderRadius: 5,
            }}
            onPress={() => handleEdit(item._id)}>
            <Text style={{fontSize: 14, color: 'white'}}>编辑</Text>
          </Button>
          <Button
            icon={{name: 'delete', size: 14, color: '#fff', type: 'antdesign'}}
            buttonStyle={{
              backgroundColor: colorStyle.danger,
              borderRadius: 5,
            }}
            onPress={() => handleDelete(item._id)}>
            <Text style={{fontSize: 14, color: 'white'}}>删除</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: colorStyle.borderMedium,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    ...fontStyle.subheading,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  cardCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: colorStyle.neutral500,
  },
  cardBody: {
    overflow: 'hidden',
  },
  cardText: {
    ...fontStyle.bodySmall,
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  boldText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
});

export default CargoCard;
