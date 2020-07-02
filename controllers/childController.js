const { Child } = require("../models");

class ChildController {
  static getAllChildren(req, res, next) {
    Child.findAll({
      attributes: [
        "id",
        "name",
        "gender",
        "birthDate",
        "condition",
        "ParentId",
      ],
    })
      .then((children) => {
        res.status(200).json(children);
      })
      .catch((err) => {
        next(err);
      });
  }

  static addChild(req, res, next) {
    const { name, gender, birthDate, condition } = req.body;
    const ParentId = req.parentData.id;

    Child.create({ name, gender, birthDate, condition, ParentId })
      .then((child) => {
        res.status(201).json(child);
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = ChildController;
