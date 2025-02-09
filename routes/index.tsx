import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackHeaderLeftProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {Icon} from '@rneui/themed';
import HomeScreen from '../screens/HomeScreen';
import CargoScreen from '../screens/cargo';
import AddBrand from '../screens/cargo/add/AddBrand';
import AddCargo from '../screens/cargo/add/AddCargo';
import AddCategory from '../screens/cargo/add/AddCategory';
import AddModel from '../screens/cargo/add/AddModel';
import AddUnit from '../screens/cargo/add/AddUnit';
import EditBrand from '../screens/cargo/edit/EditBrand';
import EditCargo from '../screens/cargo/edit/EditCargo';
import EditCategory from '../screens/cargo/edit/EditCategory';
import EditModel from '../screens/cargo/edit/EditModel';
import EditUnit from '../screens/cargo/edit/EditUnit';
import BrandManage from '../screens/cargo/manage/BrandManage';
import CargoClassify from '../screens/cargo/manage/CargoClassify';
import CargoManage from '../screens/cargo/manage/CargoManage';
import CategoryManage from '../screens/cargo/manage/CategoryManage';
import ModelManage from '../screens/cargo/manage/ModelManage';
import UnitManage from '../screens/cargo/manage/UnitManage';
import InventoryScreen from '../screens/inventory';
import CargoInventory from '../screens/inventory/CargoInventory';
import InboundManage from '../screens/inventory/InboundManage';
import InboundRecord from '../screens/inventory/InboundRecord';
import OutboundManage from '../screens/inventory/OutboundManage';
import OutboundRecord from '../screens/inventory/OutboundRecord';
import {RootStackParamList, RootTabParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// 定义主页的 Tab 导航器
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'home';
          let type = 'antdesign';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Cargo') {
            iconName = 'package';
            type = 'material-community';
          } else if (route.name === 'Inventory') {
            iconName = 'warehouse';
            type = 'material';
          }

          return <Icon name={iconName} size={size} color={color} type={type} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: '首页', headerShown: false}}
      />
      <Tab.Screen
        name="Cargo"
        component={CargoScreen}
        options={{
          title: '货品',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: '库存',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const renderHeaderLeft = (
  props: NativeStackHeaderLeftProps,
  route?: keyof RootStackParamList,
  screen?: keyof RootTabParamList,
) => {
  const navigation = useNavigation<any>();
  if (props.canGoBack) {
    return (
      <Icon
        name="chevron-back"
        type="ionicon"
        size={24}
        onPress={() => {
          if (route) {
            if (screen) {
              navigation.navigate(route, {screen});
            } else {
              navigation.navigate(route);
            }
          } else {
            navigation.goBack();
          }
        }}
      />
    );
  } else {
    return null;
  }
};

const renderHeaderRight = () => {
  const navigation = useNavigation<any>();
  return (
    <Icon
      name="home"
      size={24}
      type="material-community"
      onPress={() => {
        navigation.navigate('HomeTabs');
      }}
    />
  );
};

// 主导航器
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerLeft: renderHeaderLeft,
        headerRight: renderHeaderRight,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddCargo"
        component={AddCargo}
        options={{title: '新增货品'}}
      />
      <Stack.Screen
        name="EditCargo"
        component={EditCargo}
        options={{title: '编辑货品'}}
      />
      <Stack.Screen
        name="AddModel"
        component={AddModel}
        options={{title: '新增规格'}}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategory}
        options={{title: '新增类别'}}
      />
      <Stack.Screen
        name="AddBrand"
        component={AddBrand}
        options={{title: '新增品牌'}}
      />
      <Stack.Screen
        name="EditCategory"
        component={EditCategory}
        options={{title: '编辑类别'}}
      />
      <Stack.Screen
        name="AddUnit"
        component={AddUnit}
        options={{title: '新增单位'}}
      />
      <Stack.Screen
        name="EditUnit"
        component={EditUnit}
        options={{title: '编辑单位'}}
      />
      <Stack.Screen
        name="EditModel"
        component={EditModel}
        options={{title: '编辑规格'}}
      />
      <Stack.Screen
        name="EditBrand"
        component={EditBrand}
        options={{title: '编辑品牌'}}
      />
      <Stack.Screen
        name="CargoManage"
        component={CargoManage}
        options={{title: '货品管理'}}
      />
      <Stack.Screen
        name="CargoClassify"
        component={CargoClassify}
        options={{title: '货品分类'}}
      />
      <Stack.Screen
        name="CategoryManage"
        component={CategoryManage}
        options={{title: '类别管理'}}
      />
      <Stack.Screen
        name="UnitManage"
        component={UnitManage}
        options={{title: '单位管理'}}
      />
      <Stack.Screen
        name="ModelManage"
        component={ModelManage}
        options={{title: '规格管理'}}
      />
      <Stack.Screen
        name="BrandManage"
        component={BrandManage}
        options={{title: '品牌管理'}}
      />
      <Stack.Screen
        name="CargoInventory"
        component={CargoInventory}
        options={{title: '货品库存'}}
      />
      <Stack.Screen
        name="OutboundRecord"
        component={OutboundRecord}
        options={{
          title: '出库记录',
          headerLeft(props) {
            return renderHeaderLeft(props, 'HomeTabs', 'Inventory');
          },
        }}
      />
      <Stack.Screen
        name="OutboundManage"
        component={OutboundManage}
        options={{title: '出库管理'}}
      />
      <Stack.Screen
        name="InboundRecord"
        component={InboundRecord}
        options={{
          title: '入库记录',
          headerLeft(props) {
            return renderHeaderLeft(props, 'HomeTabs', 'Inventory');
          },
        }}
      />
      <Stack.Screen
        name="InboundManage"
        component={InboundManage}
        options={{title: '入库管理'}}
      />
    </Stack.Navigator>
  );
}
