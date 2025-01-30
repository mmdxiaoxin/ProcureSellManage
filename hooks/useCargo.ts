import {useRealm, useQuery} from '@realm/react';
import {Cargo} from '../models/Cargo';
import {BSON} from 'realm';

export type CargoData = Pick<
  Cargo,
  'name' | 'category' | 'unit' | 'description'
>;

export const useCargo = () => {
  const realm = useRealm();

  // 查询所有的 Cargo 数据
  const cargoList = useQuery(Cargo);

  // 创建新的 Cargo
  const createCargo = (cargoData: CargoData) => {
    realm.write(() => {
      const newCargo = realm.create(Cargo, {
        _id: new BSON.ObjectId(),
        ...cargoData,
        ctime: new Date(),
        utime: new Date(),
      });
      console.log('Created new Cargo:', newCargo);
    });
  };

  // 更新 Cargo
  const updateCargo = (cargoId: BSON.ObjectId, updatedData: Partial<Cargo>) => {
    realm.write(() => {
      const cargo = realm.objectForPrimaryKey(Cargo, cargoId);
      if (cargo) {
        Object.assign(cargo, updatedData, {utime: new Date()});
      }
    });
  };

  // 更新货物中的某个 CargoItem
  const updateCargoItemQuantity = (
    cargoId: BSON.ObjectId,
    itemId: BSON.ObjectId,
    newQuantity: number,
  ) => {
    realm.write(() => {
      const cargo = realm.objectForPrimaryKey(Cargo, cargoId);
      if (cargo) {
        // 查找要更新的 CargoItem
        const cargoItem = cargo.items.find(
          item => item._id.toString() === itemId.toString(),
        );
        if (cargoItem) {
          cargoItem.quantity = newQuantity; // 更新数量
          cargo.utime = new Date(); // 更新时间
        }
      }
    });
  };

  // 删除 Cargo
  const deleteCargo = (cargoId: BSON.ObjectId) => {
    try {
      realm.write(() => {
        const cargoToDelete = realm.objectForPrimaryKey(Cargo, cargoId);
        if (cargoToDelete) {
          realm.delete(cargoToDelete);
          console.log('Cargo deleted:', cargoToDelete);
        }
      });
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  };

  return {
    cargoList,
    createCargo,
    updateCargo,
    updateCargoItemQuantity,
    deleteCargo,
  };
};
