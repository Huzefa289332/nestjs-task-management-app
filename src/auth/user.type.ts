import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TaskType } from 'src/tasks/task.type';

@ObjectType('User')
export class UserType {
  @Field((type) => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field((type) => [TaskType])
  tasks: string[];

  @Field({ nullable: true })
  accessToken: string;
}
