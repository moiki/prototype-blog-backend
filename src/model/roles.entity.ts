import { Column, Entity, ManyToMany } from "typeorm";
import { MyEntity } from "./abstract/MyEntity";
import { User } from "./user.entity";

@Entity()
export class Roles extends MyEntity {
  @Column({ nullable: false })
  role_name: string;
  @Column({ nullable: false })
  description: string;
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
