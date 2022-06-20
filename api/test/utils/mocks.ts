export const mockCreateValidUserDto = {
  name: 'testname',
  email: 'test@email.com',
  password: 'testpassword',
};

export const mockCreateValidAuthDto = {
  email: 'test@email.com',
  password: 'testpassword',
};

export const mockCreateInvalidEmailAuthDto = {
  ...mockCreateValidAuthDto,
  email: 'testt@email.com',
};

export const mockCreateInvalidPasswordAuthDto = {
  ...mockCreateValidAuthDto,
  password: 'testtpassword',
};

export const mockCreateValidTaskDto = {
  name: 'test task',
  description: 'test task description',
  type: 'SHORT',
  priority: 'LOW',
  userId: 1,
};
