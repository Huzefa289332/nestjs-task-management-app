import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';

export type TaskDocument = Task & mongoose.Document;

@Schema()
export class Task {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ default: TaskStatus.OPEN })
  status: TaskStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
