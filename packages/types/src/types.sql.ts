export interface IVersionedBaseAttributes
  extends IBaseAttributes,
    IVersionAttributes {}

export interface IBaseAttributes<I = number> {
  created_by?: number;
  updated_by?: number;
  id?: I;
  created_at?: Date;
  updated_at?: Date;
}

export interface ISoftDeleteAttributes {
  deleted_at?: Date;
  deleted_by?: number;
}

export interface IVersionAttributes extends ISoftDeleteAttributes {
  source_item_id?: string;
  version?: number;
  is_active?: boolean;
}
