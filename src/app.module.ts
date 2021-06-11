import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
      },
    ),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
