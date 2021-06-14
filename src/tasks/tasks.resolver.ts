import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { GqlGetUser } from 'src/auth/gql-get-user.decorator';
import { GqlJwtAuthGuard } from 'src/auth/gql-jwt-auth.guard';
import { UserDocument } from 'src/auth/user.entity';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { DeleteTaskOutput, TaskType } from './task.type';
import { CreateTaskInput, GetTasksFilterInput } from './tasks.input';
import { TasksService } from './tasks.service';

@Resolver((of) => TaskType)
export class TaskResolver {
  constructor(
    private taskService: TasksService,
    private authService: AuthService,
  ) {}

  @Query((returns) => [TaskType])
  @UsePipes(ValidationPipe)
  @UseGuards(GqlJwtAuthGuard)
  tasks(
    @Args('getTasksFilterInput') getTasksFilterInput: GetTasksFilterInput,
    @GqlGetUser() user: UserDocument,
  ) {
    return this.taskService.getTasks(getTasksFilterInput, user);
  }

  @Query((returns) => TaskType)
  @UseGuards(GqlJwtAuthGuard)
  task(@GqlGetUser() user: UserDocument, @Args('id') id: string) {
    return this.taskService.getTaskById(id, user);
  }

  @Mutation((returns) => TaskType)
  @UsePipes(ValidationPipe)
  @UseGuards(GqlJwtAuthGuard)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @GqlGetUser() user: UserDocument,
  ) {
    return this.taskService.createTask(createTaskInput, user);
  }

  @Mutation((returns) => DeleteTaskOutput)
  @UseGuards(GqlJwtAuthGuard)
  deleteTask(@GqlGetUser() user: UserDocument, @Args('id') id: string) {
    try {
      return this.taskService.deleteTask(id, user);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Mutation((returns) => TaskType)
  @UseGuards(GqlJwtAuthGuard)
  updateTaskStatus(
    @Args('id') id: string,
    @Args('status', TaskStatusValidationPipe) status: TaskStatus,
    @GqlGetUser() user: UserDocument,
  ) {
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @ResolveField()
  user(@Parent() task: TaskType) {
    console.log(task);
    return this.authService.getUser(task.user);
  }
}
