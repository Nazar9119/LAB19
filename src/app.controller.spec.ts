import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { Request } from 'express';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'Test task' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test task' }),
    create: jest.fn().mockResolvedValue({ id: 1, title: 'New task' }),
    update: jest.fn().mockResolvedValue({ id: 1, title: 'Updated task' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of tasks', async () => {
    const mockRequest = { user: { id: 1 } } as unknown as Request;
    const result = await controller.findAll(mockRequest);
    expect(result).toEqual([{ id: 1, title: 'Test task' }]);
  });

  it('should return a single task', async () => {
    const mockRequest = { user: { id: 1 } } as unknown as Request;
    // Передаем число вместо строки
    const result = await controller.findOne(1, mockRequest);
    expect(result).toEqual({ id: 1, title: 'Test task' });
  });

  it('should create a task', async () => {
    const mockRequest = { user: { id: 1 } } as unknown as Request;
    const createTaskDto = { title: 'New task' };
    const result = await controller.create(createTaskDto, mockRequest);
    expect(result).toEqual({ id: 1, title: 'New task' });
  });
});