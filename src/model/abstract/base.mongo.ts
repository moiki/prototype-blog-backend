import { ObjectType, Field, ID } from "type-graphql";
import { prop, pre } from "@typegoose/typegoose";
// import { User } from '../user.mongo';
const contextService = require("request-context");

@pre<Base>("validate", function (next) {
  // Get the user from express context
  const user = contextService.get("req:user");

  if (this.isNew) {
    // Set the createdby value
    this.createdBy = user ? user.user : undefined;
    this.createdByName = `${user ? user.fullName : "System"}`;
    this.lastUpdatedBy = user ? user.user : undefined;
    return next();
  }

  // If the document is not new then proceed to update the lastUpdatedBy field
  this.lastUpdatedBy = user ? user.user : undefined;

  return next();
})
@pre<Base>("save", function (next) {
  // Get the user from express context
  const user = contextService.get("req:user");

  // If the document is not new then proceed to update the lastUpdatedBy field
  this.lastUpdatedBy = user ? user.user : undefined;

  return next();
})
@ObjectType()
export class Base {
  @prop({ type: Date })
  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @prop({ type: Date })
  @Field(() => Date, { nullable: false })
  updatedAt: Date;

  @prop({ required: false })
  @Field(() => ID, { nullable: true })
  createdBy: string;

  @prop({ type: String, required: false, text: true, index: true })
  @Field(() => String, { nullable: true })
  createdByName: string;

  @prop({ required: false, text: true })
  @Field(() => ID, { nullable: true })
  lastUpdatedBy: string;
}
