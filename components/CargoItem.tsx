import {Button, Icon} from '@rneui/themed';
import React, {useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import {Cargo} from '../models/Cargo';
import {colorStyle, fontStyle} from '../styles';

interface CargoItemProps {
  item: Pick<
    Cargo,
    | '_id'
    | 'name'
    | 'category'
    | 'description'
    | 'ctime'
    | 'utime'
    | 'unit'
    | 'models'
  >;
  handleEditCargo: (cargoId: BSON.ObjectId) => void;
  handleDeleteCargo: (cargoId: BSON.ObjectId) => void;
}

const CargoItem: React.FC<CargoItemProps> = ({item}) => {
  const modelsCount = item.models.length;
  const quantity = item.models.reduce(
    (acc: number, cur: any) => acc + cur.quantity,
    0,
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandHeight] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    Animated.timing(expandHeight, {
      toValue: isExpanded ? 0 : 140, // 动态展开/收起
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(prev => !prev);
  };

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
            onPress={toggleExpand}></Button>
        </View>
        <Text style={styles.cardCategory}>{item.category}</Text>
      </View>

      <Animated.View style={[styles.cardBody, {height: expandHeight}]}>
        <View style={styles.infoRow}>
          <Icon
            name="box"
            size={15}
            color={colorStyle.primary}
            style={styles.icon}
            type="font-awesome-5"
          />
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>剩余库存:</Text> {quantity}{' '}
            {item.unit}
          </Text>
        </View>
        <Text style={styles.cardText}>
          <Text style={styles.boldText}>货物描述:</Text> {item.description}
        </Text>
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
          style={[styles.cardText, {display: isExpanded ? 'none' : 'flex'}]}>
          <Text style={styles.boldText}>剩余库存:</Text> {quantity} {item.unit}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.15, // 降低透明度，形成柔和的阴影效果
    shadowRadius: 10, // 增加模糊半径，使阴影自然
    elevation: 5, // 适配 Android 设备的阴影
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
    alignItems: 'center',
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
    gap: 10,
  },
});

export default CargoItem;
