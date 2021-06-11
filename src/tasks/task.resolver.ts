import { Query, Resolver } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TasksService } from './tasks.service';

@Resolver((of) => TaskType)
export class TaskResolver {
  constructor(private taskService: TasksService) {}
}
