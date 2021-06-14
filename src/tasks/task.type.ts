import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/auth/user.type';
import { TaskStatus } from './task-status.enum';

@ObjectType('Task')
export class TaskType {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  status: TaskStatus;

  @Field((type) => UserType)
  user: string;
}

@ObjectType('DeleteTaskOutput')
export class DeleteTaskOutput {
  @Field()
  message: string;
}
