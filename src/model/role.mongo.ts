import { ObjectType, Field, ID } from "type-graphql";
import { prop, getModelForClass, pre, modelOptions, plugin, } from "@typegoose/typegoose";
import { Base } from "./abstract/base.mongo";
// import { Permission } from "./permission";
import Error from '.././middlewares/errorHandler'
import { userModel } from "./user.mongo";
import mongoPaginate from "src/utils/mongoPaginate";

// ENSURE THAT WE ARE NOT DELETEING BASE ROLES
@pre<Role>('remove', async function (next) {
  // Check if this is one of the base roles
  if (this.usedFor) {
    return next(new Error('Unable to delete the requested role'))
  }

  // Check if the role is being used
  const role = await userModel.findOne({ role: this._id })

  if (role) {
    return next(new Error('Unable to delete the requested role. It is currentyle assigned to one or more users.'))
  }

  next()
})

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
@plugin(mongoPaginate)
export class Role extends Base {
  @Field(() => ID)
  id: string

  @prop({ required: true, text: true, index: true })
  @Field({ nullable: false })
  name: string

  @prop({ required: false })
  @Field({ nullable: true })
  description: string

  // @arrayProp({ itemsRef: 'Permission' })
  // @Field(() => [Permission], { nullable: true })
  // permissions: Ref<Permission>[]

  @prop({ required: false, enum: [undefined, 'adminRole', 'baseRole'] })
  usedFor: string
}

export const roleModel = getModelForClass(Role)