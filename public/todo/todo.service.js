/**
 * @class ToDo
 *
 * Creates a list of employees and updates a list
 */

class ToDo {
  employees = [];
  employeesService;

  constructor( employeesService) {
    this. employeesService =  employeesService;
  }

  init() {
    this.render();
  }

  /**
   * DOM renderer for building the list row item.
   * Uses bootstrap classes with some custom overrides.
   *
   * {@link https://getbootstrap.com/docs/4.4/components/list-group/}
   * @example
   * <li class="list-group-item">
   *   <button class="btn btn-secondary" onclick="deleteEmployee(e, index)">X</button>
   *   <span>Employee name</span>
   *   <span>pending</span>
   *   <span>date create</span>
   * </li>
   */
  _renderListRowItem = (employee) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.id = `employee-${employee.employee_id}`;
    listGroupItem.className = 'list-group-item';

    const deleteBtn = document.createElement('button');
    const deleteBtnTxt = document.createTextNode('X');
    deleteBtn.id = 'delete-btn';
    deleteBtn.className = 'btn btn-secondary';
    deleteBtn.addEventListener('click', this._deleteEventHandler(employee.employee_id));
    deleteBtn.appendChild(deleteBtnTxt);

    const employeeNameSpan = document.createElement('span');
    const employeeName = document.createTextNode(employee.employee_name);
    employeeNameSpan.appendChild(employeeName);

    const employeeStatusSpan = document.createElement('span');
    const employeeStatus = document.createTextNode(employee.status);
    employeeStatusSpan.append( employeeStatus);

    const employeeDateSpan = document.createElement('span');
    const employeeDate = document.createTextNode(employee.created_date);
    employeeDateSpan.append(employeeDate);

    // add list item's details
    listGroupItem.append(deleteBtn);
    listGroupItem.append(employeeNameSpan);
    listGroupItem.append( employeeStatusSpan);
    listGroupItem.append(employeeDateSpan);

    return listGroupItem;
  };

  /**
   * DOM renderer for assembling the list items then mounting them to a parent node.
   */
  _renderList = () => {
    // get the "Loading..." text node from parent element
    const  employeesDiv = document.getElementById('employees');
    const loadingDiv =  employeesDiv.childNodes[0];
    const fragment = document.createDocumentFragment();
    const ul = document.createElement('ul');
    ul.id = ' employees-list';
    ul.className = 'list-group list-group-flush checked-list-box';

    this. employees.map((employee) => {
      const listGroupRowItem = this._renderListRowItem(employee);

      // add entire list item
      ul.appendChild(listGroupRowItem);
    });

    fragment.appendChild(ul);
    employeesDiv.replaceChild(fragment, loadingDiv);
  };

  /**
   * DOM renderer for displaying a default message when a user has an empty list.
   */
  _renderMsg = () => {
    const  employeesDiv = document.getElementById('employees');
    const loadingDiv =  employeesDiv.childNodes[0];
    const listParent = document.getElementById(' employees-list');
    const msgDiv = this._createMsgElement('Create some new  employees!');

    if (employeesDiv) {
      employeesDiv.replaceChild(msgDiv, loadingDiv);
    } else {
      employeesDiv.replaceChild(msgDiv, listParent);
    }
  };

  /**
   * Pure function for adding a employee.
   *
   * @param {Object} newEmployee - form's values as an object
   */
  addEmployee = async (newEmployee) => {
    try {
      const { employee_name, status } = newEmployee;
      await this. employeesService.addEmployee({employee_name, status }); // we just want the name and status
      this. employees.push(newEmployee); // push employee with all it parts
    } catch (err) {
      console.log(err);
      alert('Unable to add employee. Please try again later.');
    }
  };

  /**
   * DOM Event handler helper for adding a employee to the DOM.
   *
   * @param {number} employeeId - id of the employee to delete
   */
  _addEmployeeEventHandler = () => {
    const employeeInput = document.getElementById('formInputEmployeeName');
    const employee_name = employeeInput.value;

    const statusSelect = document.getElementById('formSelectStatus');
    const options = statusSelect.options;
    const selectedIndex = statusSelect.selectedIndex;
    const status = options[selectedIndex].text;

    // validation checks
    if (!employee_name) {
      alert('Please enter a employee name.');
      return;
    }

    const employee = {employee_name, status }; // assemble the new employee parts
    const { newEmployee, newEmployeeEl } = this._createNewEmployeeEl(employee); // add employee to list

    this.addEmployee(newEmployee);

    const listParent = document.getElementById('employees-list');

    if (listParent) {
      listParent.appendChild(newEmployeeEl);
    } else {
      this._renderList();
    }
    employeeInput.value = ''; // clear form text input
  };

  /**
   * Create the DOM element for the new employee with all its parts.
   *
   * @param {Object} employee - { employee_name, status } partial status object
   */
  _createNewEmployeeEl = (employee) => {
    const employee_id = this. employees.length;
    const created_date = new Date().toISOString();
    const newEmployee = { ...employee, employee_id, created_date };
    const newEmployeeEl = this._renderListRowItem(newEmployee);

    return { newEmployee, newEmployeeEl };
  };

  /**
   * Pure function for deleting a employee.
   *
   * @param {number} employeeId - id for the employee to be deleted
   */
  deleteEmployee = async (employeeId) => {
    try {
      const res = await this.employeesService.deleteEmployee(employeeId);
      this.employees = this.employees.filter((employee) => employee.employee_id !== employeeId);

      if (res !== null) {
        alert('Employee deleted successfully!');
      }
      return res;
    } catch (err) {
      alert('Unable to delete employee. Please try again later.');
    }
  };

  /**
   * DOM Event handler helper for deleting a employee from the DOM.
   * This relies on a pre-existing in the list of  employees.
   *
   * @param {number} employeeId - id of the employee to delete
   */
  _deleteEventHandler = (employeeId) => () => {
    const employee = document.getElementById(`employee-${employeeId}`);
    employee.remove();

    this.deleteEmployee(employeeId).then(() => {
      if (!this. employees.length) {
        this._renderMsg();
      }
    });
  };

  /**
   * Creates a message div block.
   *
   * @param {string} msg - custom message to display
   */
  _createMsgElement = (msg) => {
    const msgDiv = document.createElement('div');
    const text = document.createTextNode(msg);
    msgDiv.id = 'user-message';
    msgDiv.className = 'center';
    msgDiv.appendChild(text);

    return msgDiv;
  };

  render = async () => {
    const employees = await this. employeesService.getEmployees();

    try {
      if (employees.length) {
        this.employees =  employees;
        this._renderList();
      } else {
        this._renderMsg();
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
}
