export interface IVersionedBaseAttributes<T = string, TU = string>
  extends IBaseAttributes<T, TU>,
    IVersionAttributes<T, TU> {}

export interface IBaseAttributes<T = string, TU = string> {
  createdBy?: TU;
  updatedBy?: TU;
  _id?: T;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVersionAttributes<T = string, TU = string> {
  sourceItemId?: T;
  version?: number;
  isActive?: boolean;
  deletedAt?: Date;
  deletedBy?: TU;
}
