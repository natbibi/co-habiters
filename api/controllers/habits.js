const { Habit, UserHabit } = require('../models/Habit');

const express = require('express');
const streak = require('../helpers/streak');
const formatData = require('../helpers/formatHabits');

const router = express.Router();

async function showAllHabits(req, res) {
  try {
    const habits = await Habit.all;
    res.status(200).json(habits)
  } catch (err) {
    res.status(403).send({ err: err })
  }
}

async function createHabit(req, res) {
  try {
         /*
      if (habit == 'hello') {
        //continue
        console.log('input is fine');
        res.json(habit)
      } else {
        throw err;
        console.log(err);
      }
      */
      /*
      if (habitName != 'hi') {
        throw err
      } else {
        res.json(habit)
        console.log('try executed')
      }
      */
    const habit = await Habit.create({ ...req.body });
    res.json(habit)
  } catch (err) {
    res.status(403).send({ err: err })
  }
}

async function createUserHabit(req, res) {
  try {
    //check if valid jwt is for the requested user
    // if (res.locals.user !== req.params.username) throw err
    const jsDate = new Date().toLocaleString('en-GB', {timeZone: 'Europe/London'})
    const userHabit = await UserHabit.createUserHabit({ ...req.body, date:jsDate}, req.params.username);
    res.json(userHabit)
  } catch (err) {
    res.status(403).send({ err: err })
  }
}

async function getUserHabits(req, res) {
  try {
    //check if valid jwt is for the requested user
    // if (res.locals.user !== req.params.username) throw err
    const userHabits = await UserHabit.getUserHabits(req.params.username)
    res.json(userHabits)
  } catch (err) {
    res.status(403).send({ err: err })
  }
}

async function deleteUserHabit(req, res) {
  try {
    //check if valid jwt is for the requested user
    // if (res.locals.user !== req.params.username) throw err
    const userHabit = await UserHabit.deleteUserHabit(req.params.id)
    res.json(userHabit)
  
  } catch (err) {
    res.status(403).send({ err: err })
  }
}

async function createHabitEntry(req, res) {
  try {
    //check if valid jwt is for the requested user
    // if (res.locals.user !== req.params.username) throw err
    const jsDate = new Date().toLocaleString('en-GB', {timeZone: 'Europe/London'})
    const habitEntry = await UserHabit.createHabitEntry({ ...req.body, date: jsDate});
    res.json(habitEntry)
  } catch (err) {
    res.status(403).send({ err: err })
  }
}

async function deleteHabitEntry(req, res) {
  try {
    //check if valid jwt is for the requested user
    // if (res.locals.user !== req.params.username) throw err
    const deleteHabit = await UserHabit.deleteHabitEntry(req.params.id);
    res.json(deleteHabit)
  } catch (err) {
    res.status(403).send({ err: err })
  }
}

async function getUserHabitEntries(req, res) {
  try {
      //check if valid jwt is for the requested user
      // if (res.locals.user !== req.params.username) throw err
      const userHabits = await UserHabit.getUserHabitEntries(req.params.username)
      const habitsList = await UserHabit.getUserHabits(req.params.username)
      const streakData = streak(userHabits.allEntries)
      const result = formatData(habitsList, userHabits.habits, streakData)
      res.json(result)
      // res.json(result)
  } catch (err) {
    res.status(403).send({ err: err })
  }
}

async function autoFillHabitEntries(req, res) {
  try {
    //check if valid jwt is for the requested user
    // if (res.locals.user !== req.params.username) throw err
    const userHabits = await UserHabit.autoFillHabitEntries()
    res.json(userHabits)
  } catch (err) {
    res.status(403).send({ err: err })
  }
}

const schedule = require('node-schedule');

const job = schedule.scheduleJob(`0 0 * * *`, async function () {
  try {
    const userHabits = await UserHabit.autoFillHabitEntries();
    console.log('habit_entires auto completed')
  } catch (err) {
    console.log(err)
  }
});


module.exports = { showAllHabits, createHabit, createUserHabit, getUserHabits, getUserHabitEntries, createHabitEntry, autoFillHabitEntries , deleteUserHabit,deleteHabitEntry};
