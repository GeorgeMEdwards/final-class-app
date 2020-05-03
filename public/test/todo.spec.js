const employeesService = new EmployeesService();
const todo = new ToDo(employeesService);

describe('Todo App', () => {
  it('should initialize some HTML', () => {
    spyOn(todo, 'init');
    todo.init();

    expect(todo.init).toHaveBeenCalled();
  });

  it('should add an employee', async () => {
    const newEmployee = {
      employee_id: 0,
      employee_name: 'Third employee',
      status: 'pending',
      created_date: '2020-04-14 22:50:32',
    };
    const addEmployeeServiceSpy = spyOn(employeesService, 'addEmployee');

    expect(todo.employees.length).toBe(0);

    await todo.addEmployee(newEmployee);

    expect(addEmployeeServiceSpy).toHaveBeenCalled();
    expect(todo.employees.length).toBe(1);
  });

  it('should delete a employee', async () => {
    const existingEmployee = {
      employee_id: 0,
      employee_name: 'Third employee',
      status: 'pending',
      created_date: '2020-04-14 22:50:32',
    };
    const deleteEmployeeServiceSpy = spyOn(employeesService, 'deleteEmployee');

    expect(todo.employees.length).toBe(1);

    await todo.deleteEmployee(existingEmployee.employee_id);

    expect(deleteEmployeeServiceSpy).toHaveBeenCalled();
    expect(todo.employees.length).toBe(0);
  });

  xit('should update an individual employee', () => {
    // ..
  });
});
