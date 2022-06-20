// import { HttpStatus } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { Test, TestingModule } from '@nestjs/testing';
// import { ObjectID, Repository } from 'typeorm';
// import { WORKER_SERVICE, TASK_REPOSITORY } from './consts';
// import { GetTasksDto } from './dto/get-workspaces.dto';
// import {
//   ResponseDto,
//   TaskResponseDto,
//   TasksResponseDto,
// } from './dto/response.dto';
// import { UpdateTaskDto } from './dto/update-workspace.dto';
// import { Task } from '../tasks/entities/task.entity';
// import { TaskPriority, TaskType } from '../tasks/interfaces/task.interface';
// import { TasksService } from './workspaces.service';

// const mockCreateTaskDto = {
//   name: 'test task',
//   description: 'test task description',
//   type: TaskType.SHORT,
//   priority: TaskPriority.LOW,
//   userId: 1,
// };
// const id = 'dfieuorwieu34uoi3' as unknown as ObjectID;
// const mockTask = {
//   ...new Task(mockCreateTaskDto),
//   id,
// };

// describe('TaskspiopoService', () => {
//   let service: TasksService;
//   let repository: Repository<Task>;
//   let client: ClientProxy;
//   let findTask: jest.Mock;

//   beforeEach(async () => {
//     findTask = jest.fn().mockResolvedValue(mockTask);

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         TasksService,
//         {
//           provide: TASK_REPOSITORY,
//           useFactory: () => ({
//             findAndCount: jest.fn().mockResolvedValue([[mockTask], 2]),
//             save: jest.fn().mockReturnValue(mockTask),
//             create: jest.fn().mockReturnValue(mockTask),
//             update: jest.fn().mockResolvedValue(null),
//             delete: jest.fn().mockResolvedValue(null),
//             findOne: findTask,
//           }),
//         },
//         {
//           provide: WORKER_SERVICE,
//           useValue: {
//             emit: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<TasksService>(TasksService);
//     repository = module.get<Repository<Task>>(TASK_REPOSITORY);
//     client = module.get<ClientProxy>(WORKER_SERVICE);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('When creating one', () => {
//     it('should save a task in the database', async () => {
//       await expect(service.create(mockCreateTaskDto)).resolves.toEqual({
//         status: HttpStatus.CREATED,
//         data: mockTask,
//       });

//       expect(client.emit).toHaveBeenCalledTimes(1);
//       expect(client.emit).toBeCalledWith('new-task', mockTask);
//       expect(repository.create).toHaveBeenCalled();
//       expect(repository.create).toBeCalledWith(mockCreateTaskDto);
//       expect(repository.save).toBeCalledTimes(1);
//     });
//   });

//   describe('When getting all', () => {
//     it('should return an array of users by params', async () => {
//       const params: GetTasksDto = { limit: 5, offset: 1 };
//       await expect(service.findAll(params)).resolves.toEqual<TasksResponseDto>({
//         status: HttpStatus.OK,
//         data: {
//           items: [mockTask],
//           hasMore: false,
//           total: 2,
//         },
//       });

//       expect(repository.findAndCount).toHaveBeenCalled();
//       expect(repository.findAndCount).toBeCalledWith({
//         order: { id: 'ASC' },
//         skip: 1,
//         take: 6,
//         where: {},
//       });
//     });
//   });

//   describe('When getting one', () => {
//     describe('non existing', () => {
//       beforeEach(() => {
//         findTask.mockResolvedValue(null);
//       });
//       it('return an error', () => {
//         expect(service.findOne(id, 1)).resolves.toEqual<TaskResponseDto>({
//           status: HttpStatus.NOT_FOUND,
//           data: null,
//         });
//       });
//     });

//     describe('if user is not a creator', () => {
//       it('return an error', () => {
//         expect(service.findOne(id, 2)).resolves.toEqual<TaskResponseDto>({
//           status: HttpStatus.FORBIDDEN,
//           data: null,
//         });
//       });
//     });

//     describe('existing', () => {
//       it('should return a task', () => {
//         expect(service.findOne(id, 1)).resolves.toEqual<TaskResponseDto>({
//           status: HttpStatus.OK,
//           data: mockTask,
//         });

//         expect(repository.findOne).toHaveBeenCalled();
//         expect(repository.findOne).toBeCalledWith(id);
//       });
//     });
//   });

//   describe('When updating one', () => {
//     it('should update existing task from database', async () => {
//       const params: UpdateTaskDto = { id, name: 'super test task' };
//       await expect(
//         service.update(id, params),
//       ).resolves.toEqual<TaskResponseDto>({
//         status: HttpStatus.OK,
//         data: {
//           ...mockTask,
//           name: 'super test task',
//         },
//       });

//       expect(repository.update).toBeCalledTimes(1);
//       expect(repository.update).toBeCalledWith(id, params);
//     });
//   });

//   describe('When deleting one', () => {
//     it('should delete existing task from database', async () => {
//       await expect(service.remove(id, 1)).resolves.toEqual<ResponseDto>({
//         status: HttpStatus.OK,
//         data: null,
//       });

//       expect(repository.delete).toBeCalledTimes(1);
//       expect(repository.delete).toBeCalledWith(id);
//     });
//   });
// });
