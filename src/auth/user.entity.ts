import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Task } from 'src/tasks/task.entity';

export type UserDocument = User & mongoose.Document;

@Schema({ useNestedStrict: true })
export class User {
  @Prop()
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  salt: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Task.name }] })
  tasks: Task[];
}

export const UserSchema = SchemaFactory.createForClass(User);
