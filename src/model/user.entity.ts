import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { MyEntity } from "./abstract/MyEntity";
import { Roles } from "./roles.entity";

@Entity()
export class User extends MyEntity {
  @Column({ nullable: false })
  first_name: string;
  @Column({ nullable: false })
  last_name: string;
  @Column({ nullable: true })
  phone_number: string;
  @Column({ nullable: true })
  country: string;
  @Column({ nullable: true })
  state: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: false })
  address: string;
  @Column({ length: 300, unique: true, nullable: false })
  email: string;
  @Column({ nullable: false })
  hashed_password: string;
  @Column({ nullable: true })
  profession: string;
  @Column({ default: false })
  email_confirmed: boolean;
  @Column({ nullable: true })
  profile_picture: string;
  @ManyToMany(() => Roles, (roles) => roles.users, {
    cascade: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinTable({
    name: "user_roles_roles",
    joinColumn: {
      name: "userId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "rolesId",
      referencedColumnName: "id",
    },
  })
  roles: Roles[];
}
