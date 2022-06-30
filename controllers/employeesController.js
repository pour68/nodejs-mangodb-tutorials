const data = {};
data.employees = require("../data/employees.json");

const Employees = require("../models/Employee");

const getEmployees = async (req, res) => {
  const employees = await Employees.find();

  if (!employees || employees.length === 0)
    res.json({ message: "No employee found." });

  res.json(employees);
};

const createEmployee = async (req, res) => {
  if (!req?.body?.firstName || !req?.body?.lastName) {
    res.status(400).json({ message: "firstName and lastname is required." });
  }

  try {
    const employee = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    const result = await Employees.create(employee);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id)
    res.status(400).json({ message: "id parameter is required." });

  const employee = await Employees.findOne({
    _id: req.body.id,
  }).exec();

  if (!employee) res.status(404).json({ message: "employee not found." });

  if (req.body?.firstName) employee.firstName = req.body.firstName;
  if (req.body?.lastName) employee.lastName = req.body.lastName;
  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    res.status(400).json({ message: "id parameter is required." });

  const employee = await Employees.findOne({ _id: req.body.id }).exec();
  if (!employee) res.status(404).json({ message: "employee not found." });

  const result = await employee.delete({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    res.status(400).json({ message: "id parameter is required." });

  const employee = await Employees.findOne({ _id: req.params.id }).exec();
  if (!employee) res.status(404).json({ message: "employee not found." });

  res.json(employee);
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
