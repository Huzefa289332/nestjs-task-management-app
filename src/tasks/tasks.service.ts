import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskDocument } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}
  async getTasks(filterDto: GetTasksFilterDto): Promise<TaskDocument[]> {
    const { status, search } = filterDto;
    let tasks: TaskDocument[];
    if (status && search) {
      tasks = await this.taskModel
        .find({
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
          $or: [{ status }],
        })
        .exec();
    } else if (search) {
      tasks = await this.taskModel
        .find({
          $or: [
            { description: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
          ],
        })
        .exec();
    } else {
      tasks = await this.taskModel.find();
    }
    return tasks;
  }

  async getTaskById(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const task = new this.taskModel(createTaskDto);
    await task.save();
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    if (result.n === 0) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
  ): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    task.status = status;
    await task.save();
    return task;
  }
}
