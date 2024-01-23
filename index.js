const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

const newMember = [];

const questions = async () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?",
    },
    {
      type: "input",
      name: "id",
      message: "What is your ID number?",
    },
    {
      type: "input",
      name: "email",
      message: "What is your email?",
    },
    {
      type: "list",
      name: "role",
      message: "What is your role?",
      choices: ["Engineer", "Intern", "Manager"],
    },
  ]);
};

async function promptQuestions() {
  const answers = await questions();

  if (answers.role === "Manager") {
    const managerAns = await inquirer.prompt([
      {
        type: "input",
        name: "officeNumber",
        message: "What is your office number?",
      },
    ]);

    const newManager = new Manager(
      answers.name,
      answers.id,
      answers.email,
      managerAns.officeNumber
    );
    newMember.push(newManager);
  } else if (answers.role === "Engineer") {
    const githubAns = await inquirer.prompt([
      {
        type: "input",
        name: "github",
        message: "What is your GitHub username?",
      },
    ]);
    const newEngineer = new Engineer(
      answers.name,
      answers.id,
      answers.email,
      githubAns.github
    );
    newMember.push(newEngineer);
  } else if (answers.role === "Intern") {
    const internAns = await inquirer.prompt([
      {
        type: "input",
        name: "school",
        message: "Which university do you attend?",
      },
    ]);

    const newIntern = new Intern(
      answers.name,
      answers.id,
      answers.email,
      internAns.school
    );
    newMember.push(newIntern);
  }

  const newMemberAns = await inquirer.prompt([
    {
      type: "list",
      name: "addMember",
      message: "Would you like to continue?",
      choices: ["Add new member", "Create team!"],
    },
  ]);

  if (newMemberAns.addMember === "Add new member") {
    return promptQuestions();
  }
  return createTeam();
}

function createTeam() {
  console.log("New team member");
  fs.writeFileSync(outputPath, render(newMember), "utf-8");
}

promptQuestions();
