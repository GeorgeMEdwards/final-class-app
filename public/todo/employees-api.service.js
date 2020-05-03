const EMPLOYEES_API = `${BASE_API_URL}/employees`; // http://localhost:3000/api/employees

class EmployeesService {
  getEmployees = () => _get(EMPLOYEES_API, OPTIONS_WITH_AUTH);

  addEmployee = (formData) => _post(EMPLOYEES_API, formData, DEFAULT_OPTIONS_WITH_AUTH);

  deleteEmployee = (employeeId) => _delete(`${EMPLOYEES_API}/${employeeId}`, OPTIONS_WITH_AUTH);
}
