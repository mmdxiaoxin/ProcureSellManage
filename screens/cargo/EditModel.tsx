import {useObject} from '@realm/react';
import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import ModelValueInput, {ModelValue} from '../../components/ModelValueInput';
import {useModel} from '../../hooks/useModel';
import {Cargo} from '../../models/Cargo';
import {EditModelProps} from '../../routes/types';
import {colorStyle, fontStyle} from '../../styles';
import {parseWithOrder, stringifyWithOrder} from '../../utils';

export default function EditModel({navigation, route}: EditModelProps) {
  const cargoId = new BSON.ObjectId(route.params?.cargoId);
  const cargoItemId = new BSON.ObjectId(route.params?.cargoItemId);

  const cargo = useObject(Cargo, cargoId);
  const model = cargo?.models.find(item => item._id.equals(cargoItemId));
  const {updateModel} = useModel();

  const [spec, setSpec] = useState<ModelValue>(
    parseWithOrder(model?.value || '') || [],
  );

  // 保存型号规格
  const handleSaveModels = () => {
    if (!cargo || !model) {
      Alert.alert('错误', '未找到货物或型号');
      return;
    }

    const newValue = stringifyWithOrder(spec);
    if (cargo.models.find(item => item.value === newValue)) {
      Alert.alert('型号重复', '当前已有相同的型号!');
      return;
    }

    updateModel(cargo._id, model._id, {
      value: newValue,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>编辑型号规格</Text>

      {/* 货物属性展示卡片 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{cargo?.name}</Text>
        <Text style={styles.cardCategory}>类别: {cargo?.category}</Text>
        <Text style={styles.cardDescription}>描述: {cargo?.description}</Text>
      </View>

      {/* 货物规格输入 */}
      <ModelValueInput modelValue={spec} onChange={setSpec} />

      {/* 保存修改按钮 */}
      <Button
        title="保存修改"
        onPress={handleSaveModels}
        disabled={spec.length === 0}
        buttonStyle={{marginVertical: 10}}
      />

      {/* 取消按钮 */}
      <Button
        title="取消编辑"
        onPress={() => navigation.goBack()}
        color="warning"
        buttonStyle={{marginBottom: 40}}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    ...fontStyle.heading1,
    marginBottom: 20,
    textAlign: 'center',
  },

  // 卡片样式
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Android阴影
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorStyle.textPrimary,
    marginBottom: 5,
  },
  cardCategory: {
    fontSize: 14,
    color: colorStyle.textSecondary,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: colorStyle.textSecondary,
  },
});
