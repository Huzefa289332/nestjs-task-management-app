import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/TaskManagement', {
      useCreateIndex: true,
      useNewUrlParser: true,
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
