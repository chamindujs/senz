const express = require("express");
const router = express.Router();
const jwtVerify = require("./verifyTokens");
const Project = require("../models/project");
const Device = require("../models/device");
const User = require("../models/user");

//Create a new device for a particular user
router.post("/:userId/new", jwtVerify, (req, res) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      Device.create(req.body)
        .then(newDevice => {
          user.devices.push(newDevice);
          user.save();
          res.status(200).json(newDevice);
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });
});

//Delete a device for a particular user
router.delete("/:userId/delete/:deviceId", jwtVerify, (req, res) => {
  const userId = req.params.userId;
  const deviceId = req.params.deviceId;
  User.findById(userId)
    .then(user => {
      user.devices.remove(deviceId);
      user.save().then(pr => {
        res.status(200).json("Deleted");
      });
    })
    .catch(err => {
      throw err;
    });
});

//Get all devices of a particular user
router.get("/:userid/all", jwtVerify, (req, res) => {
  User.findById(req.params.userid)
    .populate("devices")
    .exec((err, user) => {
      if (err) throw err;
      res.status(200).json(user.devices);
    });
});

//Switch the devices of the user
router.put("/switch", jwtVerify, (req, res) => {
  const { devices, status } = req.body;
  var allUpdation = [];
  //Loop through the list of devices and change their status
  devices.map(deviceId => {
    allUpdation.push(
      Device.findByIdAndUpdate(deviceId, { $set: { status } }, { new: true })
    );
    //Change the status of the devices in all the projects it was a part of
    Device.findById(deviceId).then(foundDevice => {
      foundDevice.projects.map(projectId => {
        Project.findById(projectId).then(foundProject => {
          foundProject.devices.map(device => {
            if (device._id === deviceId) {
              device.status = status;
            }
          });
          foundProject.save();
        });
      });
    });
  });
  Promise.all(allUpdation).then(result => {
    res.status(200).json(result);
  });
});

module.exports = router;
