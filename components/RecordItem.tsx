import {Button, Icon, ListItem} from '@rneui/themed';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import {Record, RecordDetail, RecordDetailModel} from '../models/Record';
import {colorStyle} from '../styles';

interface RecordItemProps {
  item: Pick<Record, '_id' | 'detail' | 'status' | 'type' | 'ctime' | 'utime'>;
  showType?: boolean;
  onSubmitted?: (_id: BSON.ObjectID) => void;
  onDeleted?: (_id: BSON.ObjectID) => void;
}

const RecordItem: React.FC<RecordItemProps> = ({
  item,
  showType,
  onDeleted,
  onSubmitted,
}) => {
  const [expanded, setExpanded] = useState(false);
  const quantity = item.detail.reduce(
    (acc, detail) =>
      acc + detail.cargoModels.reduce((acc, model) => acc + model.quantity, 0),
    0,
  );

  // 汉化记录类型
  const getRecordType = (type: 'inbound' | 'outbound' | 'transfer') => {
    switch (type) {
      case 'inbound':
        return '入库';
      case 'outbound':
        return '出库';
      case 'transfer':
        return '调拨';
      default:
        return type;
    }
  };

  return (
    <ListItem.Accordion
      bottomDivider
      content={
        <ListItem.Content>
          <View style={styles.recordHeader}>
            {showType && (
              <Text style={styles.recordTitle}>{getRecordType(item.type)}</Text>
            )}

            <Text style={styles.recordInfoText}>
              单号: {item._id.toString()}
            </Text>

            <Text style={styles.recordInfoText}>
              {getRecordType(item.type)}总计: {quantity}
            </Text>

            <Text style={styles.recordInfoText}>
              创建日期: {item.ctime.toLocaleDateString()}{' '}
              {item.ctime.toLocaleTimeString()}
            </Text>

            <Text style={styles.recordInfoText}>
              提交日期: {item.utime.toLocaleDateString()}{' '}
              {item.utime.toLocaleTimeString()}
            </Text>

            <Text
              style={[
                styles.recordStatus,
                {color: item.status ? colorStyle.success : colorStyle.warning},
              ]}>
              {item.status ? '状态: 已完成' : '状态: 待确认'}
            </Text>
          </View>
        </ListItem.Content>
      }
      isExpanded={expanded}
      onPress={() => setExpanded(!expanded)}
      containerStyle={styles.accordion}>
      {item.detail.map((detail: RecordDetail) => (
        <View key={detail.cargoId.toString()} style={styles.detailContainer}>
          <Text style={styles.cargoName}>{detail.cargoName}</Text>
          {detail.cargoModels.map((model: RecordDetailModel) => (
            <ListItem
              containerStyle={styles.modelItem}
              key={model.modelId.toString()}
              bottomDivider>
              <Icon
                name="package-variant-closed"
                type="material-community"
                color={'grey'}
              />
              <ListItem.Content>
                <Text style={styles.modelName}>{model.modelName}</Text>
                <Text style={styles.modelQuantity}>
                  数量: {model.quantity} {detail.unit}
                </Text>
              </ListItem.Content>
              <Icon name="info" type="material" color={colorStyle.primary} />
            </ListItem>
          ))}
        </View>
      ))}
      {!item.status && (
        <>
          <Button
            title={`提交${getRecordType(item.type)}表单`}
            onPress={() => {
              onSubmitted?.(item._id);
            }}
            color={'success'}
          />
          <Button
            title={`删除当前草稿`}
            onPress={() => {
              onDeleted?.(item._id);
            }}
            color={'error'}
          />
        </>
      )}
    </ListItem.Accordion>
  );
};

const styles = StyleSheet.create({
  recordHeader: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorStyle.textPrimary,
  },
  recordStatus: {
    fontSize: 14,
    marginTop: 8,
    color: colorStyle.textSecondary,
  },
  recordInfoText: {
    fontSize: 14,
    color: colorStyle.textSecondary,
    marginVertical: 4,
  },
  accordion: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  detailContainer: {
    paddingLeft: 16,
    paddingVertical: 8,
    backgroundColor: colorStyle.neutral200,
    borderRadius: 8,
  },
  modelItem: {
    backgroundColor: colorStyle.neutral300,
  },
  cargoName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colorStyle.textPrimary,
  },
  modelName: {
    fontSize: 14,
    color: colorStyle.textPrimary,
  },
  modelQuantity: {
    fontSize: 14,
    color: colorStyle.textSecondary,
  },
});

export default RecordItem;
