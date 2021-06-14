import { TaskStatus } from '../task-status.enum';

export class TaskResponseDto {
  _id?: string;
  status: TaskStatus;
  title: string;
  description: string;
  user: string;
}
