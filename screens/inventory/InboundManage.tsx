import {
  Button,
  Icon,
  Input,
  ListItem,
  SearchBar,
  Tab,
  TabView,
  Text,
} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {BSON} from 'realm';
import {useCargo} from '../../hooks/useCargo';
import {InboundManageProps} from '../../routes/types';
import {colorStyle} from '../../styles';

type InboundDetails = Record<
  string,
  {
    cargoName: string;
    models: {modelId: BSON.ObjectId; modelName: string; quantity: string}[];
  }
>;

export default function InboundManage({navigation}: InboundManageProps) {
  const {cargoList} = useCargo();

  // 状态管理：当前选中的货品和规格
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId | null>(
    null,
  );
  const [selectedModel, setSelectedModel] = useState<BSON.ObjectId | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState(''); // 搜索框内容
  const [index, setIndex] = useState(0); // Tab 索引
  const [inboundDetails, setInboundDetails] = useState<InboundDetails>({}); // 入库明细
  const [expandedCargoIds, setExpandedCargoIds] = useState<string[]>([]); // 展开的货品 ID
  const [quantity, setQuantity] = useState('1'); // 入库数量
  const [unit, setUnit] = useState(''); // 货品单位

  // 处理选择货品
  const handleSelectCargo = (cargoId: BSON.ObjectId) => {
    setSelectedCargo(cargoId);
    setUnit(cargoList.find(item => item._id.equals(cargoId))?.unit || '件');
    setSelectedModel(null); // 重置规格
    setIndex(1);
  };

  // 处理选择规格
  const handleSelectModel = (modelId: BSON.ObjectId) => {
    setSelectedModel(modelId);
  };

  // 添加到入库明细
  const handleAddToInbound = () => {
    if (!selectedCargo || !selectedModel) {
      Alert.alert('请选择货品和规格');
      return;
    }

    const cargoName = cargoList.find(item =>
      item._id.equals(selectedCargo),
    )?.name;
    const modelName = cargoList
      .find(item => item._id.equals(selectedCargo))
      ?.models.find(item => item._id.equals(selectedModel))?.name;

    if (!cargoName || !modelName) {
      Alert.alert('货品或规格不存在');
      return;
    }

    // 验证数量是否为有效的数字
    if (quantity.match(/^(?:0|(?:-?[1-9]\d*))$/) === null) {
      Alert.alert('请输入正确的数量');
      return;
    }

    setInboundDetails(prevState => {
      const updatedDetails = {...prevState};

      // 如果该货品已存在
      if (updatedDetails[selectedCargo.toHexString()]) {
        const existingItem = updatedDetails[selectedCargo.toHexString()];

        // 查找相同规格是否存在
        const existingModel = existingItem.models.find(model =>
          model.modelId.equals(selectedModel),
        );

        if (existingModel) {
          // 如果存在，则更新数量（确保将 quantity 转换为数字后进行累加）
          existingModel.quantity = (
            Number(existingModel.quantity) + Number(quantity)
          ).toString();
        } else {
          // 如果规格不存在，则添加新的规格
          existingItem.models.push({
            modelId: selectedModel,
            modelName,
            quantity,
          });
        }
      } else {
        // 如果该货品不存在，则创建新的货品节点
        updatedDetails[selectedCargo.toHexString()] = {
          cargoName,
          models: [
            {
              modelId: selectedModel,
              modelName,
              quantity,
            },
          ],
        };
      }

      return updatedDetails;
    });

    // 重置状态
    setSelectedCargo(null);
    setSelectedModel(null);
    setQuantity('1'); // 重置数量
    setIndex(2);
  };

  // 提交入库单
  const handleSubmit = () => {
    console.log('入库单已提交', inboundDetails);
  };

  // 保存为草稿
  const handleSaveDraft = () => {
    console.log('草稿已保存', inboundDetails);
  };

  // 根据 category 分类货品
  const categorizedCargoList = () => {
    const categorized = cargoList.reduce((acc, cargo) => {
      const category = cargo.category || '未分类'; // 处理没有 category 的情况
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(cargo);
      return acc;
    }, {} as Record<string, any[]>);

    // 将分类数据转换为 SectionList 所需的格式
    return Object.keys(categorized).map(category => ({
      title: category,
      data: categorized[category],
    }));
  };

  // 渲染货品部分
  const renderCargoList = () => (
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
        <Text style={styles.sectionHeader}>{title}</Text>
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

  // 渲染规格部分
  const renderModelList = () => (
    <>
      {selectedCargo ? (
        <FlatList
          data={cargoList.find(item => item._id.equals(selectedCargo))?.models}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <ListItem bottomDivider onPress={() => handleSelectModel(item._id)}>
              <ListItem.Content>
                <Icon
                  name={
                    selectedModel?.toHexString() === item._id.toHexString()
                      ? 'label-important'
                      : 'label-important-outline'
                  }
                  type="material"
                  color={
                    selectedModel?.toHexString() === item._id.toHexString()
                      ? colorStyle.primary
                      : colorStyle.textPrimary
                  }
                />
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>
                  当前库存: {item.quantity} {unit}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                padding: 16,
                color: colorStyle.textSecondary,
              }}>
              该货品暂无规格。
            </Text>
          }
        />
      ) : (
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            padding: 16,
            color: colorStyle.textSecondary,
          }}>
          请先选择货品。
        </Text>
      )}
      {selectedModel && (
        <Input
          label="入库数量"
          value={String(quantity)}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="请输入数量"
          labelStyle={{marginTop: 16}}
        />
      )}
    </>
  );

  // 切换展开/折叠
  const toggleAccordion = (cargoId: string) => {
    setExpandedCargoIds(prevState =>
      prevState.includes(cargoId)
        ? prevState.filter(id => id !== cargoId)
        : [...prevState, cargoId],
    );
  };

  // 渲染入库明细部分
  const renderInboundDetails = () => (
    <FlatList
      data={Object.values(inboundDetails)}
      keyExtractor={item => item.cargoName}
      renderItem={({item}) => (
        <ListItem.Accordion
          key={item.cargoName}
          content={
            <ListItem.Content>
              <ListItem.Title style={styles.cargoTitle}>
                {item.cargoName}
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expandedCargoIds.includes(item.cargoName)}
          onPress={() => toggleAccordion(item.cargoName)}>
          {item.models.map(model => (
            <ListItem key={model.modelId.toString()} bottomDivider>
              <Icon
                name="package-variant-closed"
                type="material-community"
                color={'grey'}
              />
              <ListItem.Content>
                <ListItem.Title>{model.modelName}</ListItem.Title>
                <ListItem.Subtitle>
                  数量: {model.quantity} {unit}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </ListItem.Accordion>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索框 */}
      <SearchBar
        placeholder="筛选货品"
        value={searchQuery}
        onChangeText={setSearchQuery}
        lightTheme
        round
      />

      <Tab value={index} onChange={e => setIndex(e)}>
        <Tab.Item
          title="选择货品"
          titleStyle={{fontSize: 12}}
          icon={{name: 'archive', type: 'material'}}
        />
        <Tab.Item
          title="选择规格"
          titleStyle={{fontSize: 12}}
          icon={{name: 'layers', type: 'material'}}
        />
        <Tab.Item
          title="入库明细"
          titleStyle={{fontSize: 12}}
          icon={{name: 'clipboard-list', type: 'font-awesome-5'}}
        />
      </Tab>

      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        containerStyle={styles.mainContent}>
        <TabView.Item style={styles.tabContainer}>
          {renderCargoList()}
        </TabView.Item>
        <TabView.Item style={styles.tabContainer}>
          {renderModelList()}
        </TabView.Item>
        <TabView.Item style={styles.tabContainer}>
          {renderInboundDetails()}
        </TabView.Item>
      </TabView>

      {/* 操作按钮 */}
      <View style={styles.buttonContainer}>
        <Button
          title="添加入库货品"
          onPress={handleAddToInbound}
          color={'primary'}
          disabled={!selectedCargo || !selectedModel}
        />
        <Button
          title="提交入库单"
          onPress={handleSubmit}
          color={'success'}
          disabled={Object.keys(inboundDetails).length === 0}
        />
        <Button
          title="保存草稿"
          onPress={handleSaveDraft}
          color={'error'}
          disabled={Object.keys(inboundDetails).length === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    paddingLeft: 16,
    backgroundColor: colorStyle.primary,
    color: colorStyle.white,
  },
  cargoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 16,
  },
  mainContent: {
    flex: 7,
  },
  tabContainer: {
    width: '100%',
    padding: 16,
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'column',
    padding: 16,
    gap: 10,
  },
});
