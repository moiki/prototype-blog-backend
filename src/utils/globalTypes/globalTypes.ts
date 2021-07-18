import { Field, ObjectType } from 'type-graphql';

export enum ROLE_TYPE {
	MASTER = 'master',
	ADMIN = 'administrator',
}
@ObjectType('GeneralResponse', { isAbstract: true })
export abstract class GeneralResponse {
	@Field()
	status: boolean;
	@Field()
	message: string;
}
