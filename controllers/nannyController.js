const { Nanny, Agency, Parent, NannyChild, Child } = require("../models");

class NannyController {
  static getAllNannies(req, res, next) {
    Nanny.findAll({
      attributes: [
        "id",
        "name",
        "gender",
        "phoneNumber",
        "birthDate",
        "address",
        "imageUrl",
        "city",
        "expectedSalary",
        "availability",
        "ParentId",
        "AgencyId",
      ],
      where: { availability: true },
    })
      .then((nannies) => {
        res.status(200).json(nannies);
      })
  }

  static registerNanny(req, res, next) {
    const {
      name,
      gender,
      phoneNumber,
      birthDate,
      address,
      imageUrl,
      city,
      expectedSalary,
    } = req.body;

    Nanny.create({
      name,
      gender,
      phoneNumber,
      birthDate,
      address,
      imageUrl,
      city,
      expectedSalary,
    })
      .then((nanny) => {
        res.status(201).json(nanny);
      })
  }

  static addNanny(req, res, next) {
    const {
      name,
      gender,
      phoneNumber,
      birthDate,
      address,
      imageUrl,
      city,
      expectedSalary,
    } = req.body;
    const AgencyId = req.agencyData.id;

    Nanny.create({
      name,
      gender,
      phoneNumber,
      birthDate,
      address,
      imageUrl,
      city,
      expectedSalary,
      AgencyId,
    })
      .then((nanny) => {
        res.status(201).json(nanny);
      })
  }

  static getNannyById(req, res, next) {
    const { id } = req.params;
    Nanny.findOne({
      where: { id },
      include: [{ model: Agency, attributes: ["id", "name"] }],
    })
      .then((nanny) => {
        if (!nanny) {
          next({ name: "ERR_NOT_FOUND" });
        } else {
          res.status(200).json(nanny);
        }
      })
  }

  static updateDataNanny(req, res, next) {
    const {
      name,
      gender,
      phoneNumber,
      birthDate,
      address,
      imageUrl,
      city,
      expectedSalary,
    } = req.body;
    const { id } = req.params;
    Nanny.findOne({ where: { id } })
      .then((nanny) => {
        if (!nanny) {
          throw next({ name: "ERR_NOT_FOUND" });
        } else {
          return Nanny.update(
            {
              name,
              gender,
              phoneNumber,
              birthDate,
              address,
              imageUrl,
              city,
              expectedSalary,
            },
            { where: { id } }
          );
        }
      })
      .then((resp) => {
        if (resp[0] === 1) {
          res.status(200).json({ message: "Successfully updated" });
        } else {
          next({ name: "ERR_NOT_FOUND" });
        }
      })
  }

  static deleteById(req, res, next) {
    const { id } = req.params;
    Nanny.findOne({ where: { id } })
      .then((nanny) => {
        if (!nanny) {
          throw next({ name: "ERR_NOT_FOUND" });
        } else {
          return Nanny.destroy({ where: { id } });
        }
      })
      .then((resp) => {
        if (resp === 1) {
          res.status(200).json({ message: "Successfully deleted" });
        } else {
          next(err);
        }
      })
  }

  static updateAvailStatusNanny(req, res, next) {
    const { id } = req.params;
    Nanny.update({ availability: false }, { where: { id } })
      .then((resp) => {
        if (resp[0] === 1) {
          res.status(200).json({ message: "Updated nanny status success" });
        } else {
          next({ name: "ERR_NOT_FOUND" });
        }
      })
  }

  static findAllCorrespondingNanny(req, res, next) {
    const AgencyId = req.agencyData.id;
    Nanny.findAll({
      where: { AgencyId },
      attributes: [
        "id",
        "name",
        "gender",
        "phoneNumber",
        "birthDate",
        "address",
        "imageUrl",
        "city",
        "expectedSalary",
        "availability",
        "ParentId",
        "AgencyId",
      ],
    })
      .then((nannies) => {
        res.status(200).json(nannies);
      })
  }
  
}

module.exports = NannyController;
