import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {cargoRepository} from '../models/CargoRepository';
import RNFS from 'react-native-fs';

export default function InventoryScreen() {
  const [cargoList, setCargoList] = useState<any[]>([]); // 存储货物列表

  useEffect(() => {
    // 获取所有货物
    const loadCargoData = async () => {
      const cargos = await cargoRepository.getAllCargo();
      setCargoList(cargos as any[]);
    };

    const deleteRealmDatabase = async () => {
      const realmPath = `${RNFS.DocumentDirectoryPath}/cargo.realm`; // 默认路径
      try {
        // 删除数据库文件
        await RNFS.unlink(realmPath);
        console.log('Realm database file deleted successfully!');
      } catch (error) {
        console.error('Error deleting Realm database:', error);
      }
    };
    deleteRealmDatabase();
    loadCargoData();
  }, []);

  // 处理货物删除操作
  const handleDeleteCargo = (cargoId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this cargo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await cargoRepository.deleteCargo(cargoId);
              setCargoList(
                prevCargoList =>
                  prevCargoList.filter(cargo => cargo.cargoId !== cargoId), // 更新列表
              );
              console.log('Cargo deleted!');
            } catch (error) {
              console.error('Error deleting cargo:', error);
            }
          },
        },
      ],
    );
  };

  // 处理货物状态更新
  const handleUpdateStatus = async (cargoId: string, newStatus: string) => {
    try {
      await cargoRepository.updateCargoStatus(cargoId, newStatus);
      setCargoList(prevCargoList =>
        prevCargoList.map(cargo =>
          cargo.cargoId === cargoId ? {...cargo, status: newStatus} : cargo,
        ),
      );
      console.log('Cargo status updated!');
    } catch (error) {
      console.error('Error updating cargo status:', error);
    }
  };

  // 处理创建货物
  const handleCreateCargo = async () => {
    try {
      const newCargo = {
        name: 'Furniture',
        description: 'Chairs and tables',
        weight: 25.5,
        volume: 0.08,
        origin: 'Beijing',
        destination: 'Los Angeles',
        shippingDate: new Date('2025-01-25'),
        estimatedArrival: new Date('2025-02-05'),
        status: 'Pending',
        trackingNumber: 'TN987654321',
      };

      await cargoRepository.createCargo(newCargo); // 创建货物

      // 重新获取并更新货物列表
      const cargos = await cargoRepository.getAllCargo();
      setCargoList(
        cargos.map(cargo => ({
          ...cargo,
          cargoId: String(cargo.cargoId), // 确保 cargoId 是字符串类型
        })),
      );
    } catch (error) {
      console.error('Error creating cargo:', error);
    }
  };

  // 渲染货物项
  const renderCargoItem = ({item}: {item: any}) => (
    <View
      style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
      <Text>Name: {item.name}</Text>
      <Text>Status: {item.status}</Text>
      <Text>
        Origin: {item.origin} - Destination: {item.destination}
      </Text>
      <Text>
        Shipping Date:{' '}
        {item.shippingDate instanceof Date
          ? item.shippingDate.toLocaleDateString()
          : 'Invalid Date'}
      </Text>
      <Text>
        Estimated Arrival:{' '}
        {item.estimatedArrival instanceof Date
          ? item.estimatedArrival.toLocaleDateString()
          : 'Invalid Date'}
      </Text>
      <TouchableOpacity
        style={{marginTop: 10, backgroundColor: '#4CAF50', padding: 10}}
        onPress={() => handleUpdateStatus(item.cargoId, 'Shipped')}>
        <Text style={{color: '#fff'}}>Mark as Shipped</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginTop: 10, backgroundColor: '#f44336', padding: 10}}
        onPress={() => handleDeleteCargo(item.cargoId)}>
        <Text style={{color: '#fff'}}>Delete Cargo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>Cargo Management</Text>
      <Button title="Create Cargo" onPress={handleCreateCargo} />
      <FlatList
        data={cargoList}
        renderItem={renderCargoItem} // 渲染货物项
        keyExtractor={item => String(item.cargoId)} // 确保 cargoId 是字符串类型
      />
    </View>
  );
}
