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
//asking the generic questions for all roles
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
//These are the questions for specific roles. depending on what the users chooses 
async function promptQuestions() {
  const answers = await questions();
  //If user selects manager, ask for their office number
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
    //if engineer is selected then ask for their github username
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
    //If intern is selected then ask what school they go to
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
//if the user wants to continue or create the html file.
  const newMemberAns = await inquirer.prompt([
    {
      type: "list",
      name: "addMember",
      message: "Would you like to continue?",
      choices: ["Add new member", "Create team!"],
    },
  ]);
//keep asking the questions one the user selects "add new member"
  if (newMemberAns.addMember === "Add new member") {
    return promptQuestions();
  }
  return createTeam();
}
//Writing to the file so that the user can see the output
function createTeam() {
  console.log("New team member");
  fs.writeFileSync(outputPath, render(newMember), "utf-8");
}

promptQuestions();
