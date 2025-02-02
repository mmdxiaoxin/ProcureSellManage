import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// 根 Tab 参数类型
export type RootTabParamList = {
  Home: undefined;
  Cargo: undefined | {cargoId: string};
  Inventory: undefined;
};

// 根 Stack 参数类型
export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<RootTabParamList>;
  AddCargo: undefined;
  AddModel: {cargoId: string} | undefined;
  AddCategory: undefined;
  AddUnit: undefined;
  EditCargo: {cargoId: string};
  EditModel: {cargoId: string; cargoItemId: string};
  CargoManagement: undefined;
  CargoInventory: undefined;
  OutboundManagement: undefined;
  InboundManagement: undefined;
};

// 为 AddCargo, AddModel, EditCargo 提供正确的类型
export type AddCargoProps = NativeStackScreenProps<
  RootStackParamList,
  'AddCargo'
>;
export type AddModelProps = NativeStackScreenProps<
  RootStackParamList,
  'AddModel'
>;
export type AddCategoryProps = NativeStackScreenProps<
  RootStackParamList,
  'AddCategory'
>;
export type AddUnitProps = NativeStackScreenProps<
  RootStackParamList,
  'AddUnit'
>;
export type EditCargoProps = NativeStackScreenProps<
  RootStackParamList,
  'EditCargo'
>;
export type EditModelProps = NativeStackScreenProps<
  RootStackParamList,
  'EditModel'
>;
export type CargoManagementProps = NativeStackScreenProps<
  RootStackParamList,
  'CargoManagement'
>;
export type CargoInventoryProps = NativeStackScreenProps<
  RootStackParamList,
  'CargoInventory'
>;
export type OutboundManagementProps = NativeStackScreenProps<
  RootStackParamList,
  'OutboundManagement'
>;
export type InboundManagementProps = NativeStackScreenProps<
  RootStackParamList,
  'InboundManagement'
>;

// 为 Tab 屏幕定义 props 类型，结合 BottomTabScreenProps 和 NativeStackScreenProps
export type HomeScreenProps = BottomTabScreenProps<RootTabParamList, 'Home'> &
  NativeStackScreenProps<RootStackParamList>;
export type CargoScreenProps = BottomTabScreenProps<RootTabParamList, 'Cargo'> &
  NativeStackScreenProps<RootStackParamList>;
export type InventoryScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'Inventory'
> &
  NativeStackScreenProps<RootStackParamList>;
