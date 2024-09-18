export interface IVersionedBaseAttributes extends IBaseAttributes, IVersionAttributes {}

export interface IBaseAttributes {
  created_by?: string;
  updated_by?: string;
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IVersionAttributes {
  source_item_id?: string;
  version?: number;
  is_active?: boolean;
  deleted_at?: Date;
  deleted_by?: string;
}
