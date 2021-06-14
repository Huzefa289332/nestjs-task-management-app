import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TasksService } from 'src/tasks/tasks.service';
import { AuthService } from './auth.service';
import { GqlGetUser } from './gql-get-user.decorator';
import { GqlJwtAuthGuard } from './gql-jwt-auth.guard';
import { UserDocument } from './user.entity';
import { SigninInput, SignupInput } from './user.input';
import { UserType } from './user.type';

@Resolver((of) => UserType)
export class UserResolver {
  constructor(
    private authService: AuthService,
    private taskService: TasksService,
  ) {}

  @Query((returns) => [UserType])
  @UseGuards(GqlJwtAuthGuard)
  users(@GqlGetUser() user) {
    return this.authService.getUsers(user._id);
  }

  @Query((returns) => UserType)
  @UseGuards(GqlJwtAuthGuard)
  user(@GqlGetUser() user: UserDocument) {
    return this.authService.getUser(user._id);
  }

  @Mutation((returns) => UserType)
  @UsePipes(ValidationPipe)
  signin(@Args('signinInput') signinInput: SigninInput) {
    return this.authService.signin(signinInput);
  }

  @Mutation((returns) => UserType)
  @UsePipes(ValidationPipe)
  signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @ResolveField()
  tasks(@Parent() user: UserType) {
    return this.taskService.getTasksByUser(user);
  }
}
