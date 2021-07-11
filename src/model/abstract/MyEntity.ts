import {
  BaseEntity,
  Column,
  CreateDateColumn,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

export abstract class MyEntity extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column({ unique: true, type: "uuid", default: uuidv4(), generated: "uuid" })
  id: string;
  @Column({ type: "boolean", default: true })
  is_active: boolean;
  @CreateDateColumn()
  created_date: string;
  @UpdateDateColumn({ nullable: true })
  updated_date: string;
  @VersionColumn()
  entity_version: string;
}
