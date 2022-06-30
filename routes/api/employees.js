const express = require("express");
const router = express.Router();
const roles = require("../../configs/roles");
const verifyRoles = require("../../middlewares/verifyRoles");
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
} = require("../../controllers/employeesController");

router
  .route("/")
  .get(getEmployees)
  .post(verifyRoles(roles.admin, roles.editor), createEmployee)
  .put(verifyRoles(roles.admin, roles.editor), updateEmployee)
  .delete(verifyRoles(roles.admin), deleteEmployee);

router.route("/:id").get(getEmployee);

module.exports = router;
