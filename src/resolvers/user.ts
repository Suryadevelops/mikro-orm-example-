import { User } from '../entities/User';
import { MyContext } from '../types';
import { Resolver, Mutation, Arg, InputType, Field, Ctx } from "type-graphql"
import argon2 from 'argon2'

@InputType()
class UsernmamePasswordInput {
	@Field()
	username: string
	@Field()
	password: string
}

@Resolver()
export class UserResolver {
	@Mutation(() => User)
	async register(
		@Arg('options') options: UsernmamePasswordInput,
		@Ctx() { em }: MyContext
	) {
		const hashedPassword = await argon2.hash(options.password)
		const user = em.create(User, { username: options.username, password: hashedPassword })
		await em.persistAndFlush(user);
		return user;
	}
}
