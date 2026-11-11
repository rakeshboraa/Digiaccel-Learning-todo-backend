
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, MaxLength,
} from 'class-validator';

import {
  TodoStatus,
} from '../schemas/todo.schema.js';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
