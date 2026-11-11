import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument, TodoStatus } from './schemas/todo.schema.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name)
    private todoModel: Model<TodoDocument>,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    const todo = new this.todoModel(createTodoDto);
    return todo.save();
  }

  async findAll(search?: string) {
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    return this.todoModel.find(filter).sort({ dateTime: 1 });
  }

  async findOne(id: string) {
    const todo = await this.todoModel.findById(id);

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todoModel.findByIdAndUpdate(id, updateTodoDto, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async remove(id: string) {
    const todo = await this.todoModel.findByIdAndDelete(id);

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return {
      success: true,
      message: 'Todo deleted successfully',
    };
  }

  async updateStatus(id: string, status: TodoStatus) {
    const todo = await this.todoModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async getWeeklySummary(timezone = 'Asia/Kolkata') {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
    } catch {
      throw new BadRequestException('Invalid timezone');
    }

    return this.todoModel.aggregate([
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: '$dateTime',
              unit: 'week',
              startOfWeek: 'monday',
              timezone,
            },
          },
          openTasks: {
            $sum: {
              $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0],
            },
          },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          weekStart: '$_id',
          openTasks: 1,
          completedTasks: 1,
          totalTasks: {
            $add: ['$openTasks', '$completedTasks'],
          },
        },
      },
      {
        $sort: { weekStart: -1 },
      },
    ]);
  }
}
