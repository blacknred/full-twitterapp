// import { HttpStatus } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { ObjectID } from 'typeorm';
// import { CreateTaskDto } from './dto/create-workspace.dto';
// import { GetTaskDto } from './dto/get-workspace.dto';
// import { GetTasksDto } from './dto/get-workspaces.dto';
// import {
//   ResponseDto,
//   TaskResponseDto,
//   TasksResponseDto,
// } from './dto/response.dto';
// import { UpdateTaskDto } from './dto/update-workspace.dto';
// import { Task } from '../tasks/entities/task.entity';
// import { TaskPriority, TaskType } from '../tasks/interfaces/task.interface';
// import { TasksController } from './workspaces.controller';
// import { TasksService } from './workspaces.service';

// const mockCreateTaskDto = {
//   name: 'test task',
//   description: 'test task description',
//   type: TaskType.SHORT,
//   priority: TaskPriority.LOW,
//   userId: 1,
// };
// const mockTask = new Task(mockCreateTaskDto);
// const id = 'dfieuorwieu34uoi3' as unknown as ObjectID;

// describe('TasksController', () => {
//   let controller: TasksController;
//   let service: TasksService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [TasksController],
//       providers: [
//         {
//           provide: TasksService,
//           useValue: {
//             create: jest.fn().mockResolvedValue(
//               Promise.resolve({
//                 status: HttpStatus.CREATED,
//                 data: mockTask,
//               }),
//             ),
//             findAll: jest.fn().mockResolvedValue(
//               Promise.resolve({
//                 status: HttpStatus.OK,
//                 data: {
//                   items: [mockTask],
//                   hasMore: false,
//                   total: 2,
//                 },
//               }),
//             ),
//             findOne: jest.fn().mockResolvedValue({
//               status: HttpStatus.OK,
//               data: mockTask,
//             }),
//             update: jest.fn().mockResolvedValue({
//               status: HttpStatus.OK,
//               data: {
//                 ...mockTask,
//                 name: 'super test task',
//               },
//             }),
//             remove: jest.fn((params: CreateTaskDto) =>
//               Promise.resolve({
//                 status: HttpStatus.OK,
//                 data: null,
//               }),
//             ),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<TasksController>(TasksController);
//     service = module.get<TasksService>(TasksService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('When creating one', () => {
//     it('should create a new task', async () => {
//       const response = {
//         status: HttpStatus.CREATED,
//         data: mockTask,
//       };
//       const createSpy = jest
//         .spyOn(service, 'create')
//         .mockResolvedValueOnce(response);
//       await expect(
//         controller.create(mockCreateTaskDto),
//       ).resolves.toEqual<TaskResponseDto>(response);
//       expect(createSpy).toBeCalledWith(mockCreateTaskDto);
//       // expect(service.findOne(2)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('When getting all', () => {
//     it('should return an array of tasks by params', async () => {
//       const params: GetTasksDto = { limit: 5, offset: 1 };
//       await expect(
//         controller.getAll(params),
//       ).resolves.toEqual<TasksResponseDto>({
//         status: HttpStatus.OK,
//         data: {
//           items: [mockTask],
//           hasMore: false,
//           total: 2,
//         },
//       });
//     });
//   });

//   describe('When getting one', () => {
//     it('should return a task', async () => {
//       const params: GetTaskDto = { id };
//       await expect(controller.getOne(params)).resolves.toEqual<TaskResponseDto>(
//         {
//           status: HttpStatus.OK,
//           data: mockTask,
//         },
//       );
//     });
//   });

//   describe('When updating one', () => {
//     it('should update a task', async () => {
//       const params: UpdateTaskDto = { id, name: 'super test task' };
//       await expect(controller.update(params)).resolves.toEqual<TaskResponseDto>(
//         {
//           status: HttpStatus.OK,
//           data: {
//             ...mockTask,
//             name: 'super test task',
//           },
//         },
//       );
//     });
//   });

//   describe('When deleting one', () => {
//     it('should delete a task', async () => {
//       const params: GetTaskDto = { id };
//       await expect(controller.remove(params)).resolves.toEqual<ResponseDto>({
//         status: HttpStatus.OK,
//         data: null,
//       });
//     });
//   });
// });
