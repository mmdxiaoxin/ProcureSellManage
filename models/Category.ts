import Realm, {BSON} from 'realm';
import {Cargo} from '.';

export class Category extends Realm.Object {
  _id!: BSON.ObjectId;
  name!: string;
  cargo!: Realm.Results<Cargo>;
  description?: string;
  ctime!: Date;
  utime!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Category',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      cargo: {
        type: 'linkingObjects',
        objectType: 'Cargo', // 关联到 Cargo 模型
        property: 'category', // 反向关系字段名
      },
      description: 'string?',
      ctime: 'date',
      utime: 'date',
    },
  };
}
