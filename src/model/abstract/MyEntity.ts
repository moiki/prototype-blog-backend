import {
  BaseEntity,
  Column,
  CreateDateColumn,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

export abstract class MyEntity extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;
  @Column({ unique: true, nullable: false })
  reference_id: string;
  @Column({ type: "boolean", default: true })
  is_active: boolean;
  @CreateDateColumn()
  created_date: string;
  @UpdateDateColumn({ nullable: true })
  updated_date: string;
  @VersionColumn()
  entity_version: string;
}
