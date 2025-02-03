import {Icon, ListItem, Text} from '@rneui/themed';
import React from 'react';
import {SectionList} from 'react-native';
import {BSON, Results} from 'realm';
import {Cargo} from '../models/Cargo';
import {colorStyle} from '../styles';

interface CargoListProps {
  cargoList: Results<Cargo>;
  selectedCargo: BSON.ObjectId | null;
  handleSelectCargo: (cargoId: BSON.ObjectId) => void;
}

const CargoList: React.FC<CargoListProps> = ({
  cargoList,
  selectedCargo,
  handleSelectCargo,
}) => {
  const categorizedCargoList = () => {
    const categorized = cargoList.reduce((acc, cargo) => {
      const category = cargo.category || '未分类'; // 处理没有 category 的情况
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(cargo);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.keys(categorized).map(category => ({
      title: category,
      data: categorized[category],
    }));
  };

  return (
    <SectionList
      sections={categorizedCargoList()}
      keyExtractor={(item, index) => item._id.toString() + index}
      renderItem={({item}) => (
        <ListItem bottomDivider onPress={() => handleSelectCargo(item._id)}>
          <Icon
            name={
              selectedCargo?.toHexString() === item._id.toHexString()
                ? 'label-important'
                : 'label-important-outline'
            }
            type="material"
            color={
              selectedCargo?.toHexString() === item._id.toHexString()
                ? colorStyle.primary
                : colorStyle.textPrimary
            }
          />
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      )}
      renderSectionHeader={({section: {title}}) => (
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            paddingLeft: 16,
            backgroundColor: colorStyle.primary,
            color: colorStyle.white,
          }}>
          {title}
        </Text>
      )}
      ListEmptyComponent={
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            padding: 16,
            color: colorStyle.textSecondary,
          }}>
          当前暂无货品。
        </Text>
      }
    />
  );
};

export default CargoList;
