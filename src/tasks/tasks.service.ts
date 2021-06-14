import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskDocument } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { UserDocument } from 'src/auth/user.entity';
import { TaskResponseDto } from './dto/task-response.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}
  async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserDocument,
  ): Promise<TaskDocument[]> {
    const { status, search } = filterDto;
    let tasks: TaskDocument[];
    if (status && search) {
      tasks = await this.taskModel
        .find({
          user: user.id,
          $or: [
            { status },
            { description: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
          ],
        })
        .exec();
    } else if (status) {
      tasks = await this.taskModel
        .find({
          user: user.id,
          $or: [{ status }],
        })
        .exec();
    } else if (search) {
      tasks = await this.taskModel
        .find({
          user: user.id,
          $or: [
            { description: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
          ],
        })
        .exec();
    } else {
      tasks = await this.taskModel.find({ user: user.id });
    }
    return tasks;
  }

  async getTaskById(id: string, user: UserDocument): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOne({ _id: id, user: user.id })
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return task;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserDocument,
  ): Promise<TaskResponseDto> {
    const task = new this.taskModel(createTaskDto);
    task.user = user;
    await task.save();
    const userDoc = task.user as UserDocument;
    const userId: string = userDoc.id;
    const taskResponse = task.toObject();
    delete taskResponse.user;
    taskResponse.id = taskResponse._id;
    delete taskResponse._id;
    return { ...taskResponse, user: userId };
  }

  async deleteTask(
    id: string,
    user: UserDocument,
  ): Promise<{ message: string }> {
    const result = await this.taskModel
      .deleteOne({ _id: id, user: user.id })
      .exec();
    if (result.n === 0) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    } else {
      return { message: `Task with ID: ${id} is successfully deleted` };
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: UserDocument,
  ): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOne({ _id: id, user: user.id })
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    task.status = status;
    await task.save();
    return task;
  }

  async getTasksByUser(user): Promise<TaskDocument[]> {
    return this.taskModel.find({ user: user.id });
  }
}
