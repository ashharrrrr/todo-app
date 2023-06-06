import { Project, Todo } from "./logic";
import { format } from "date-fns";

const projectList = document.querySelector(".project-list");
const taskList = document.querySelector(".task-list");

const headingProjectName = document.querySelector(".project-name");
const headingProjectDescription = document.querySelector(
  ".project-description"
);

const projectForm = document.querySelector("#project");
const projectName = document.querySelector("#project-name");
const projectDescription = document.querySelector("#project-description");

const taskForm = document.querySelector("#task");
const taskName = document.querySelector("#task-name");
const taskDescription = document.querySelector("#task-description");
const taskDueDate = document.querySelector("#task-due-date");

export let projectsArray = [];
let currentProject = "";

export default function fetchFormData() {
  projectForm.addEventListener("submit", () => {
    cleanTasks();
    const project = new Project(projectName.value, projectDescription.value);
    projectsArray.push(project);
    console.log(projectsArray);
    currentProject = projectName.value;

    headingProjectName.textContent = projectName.value;
    headingProjectDescription.textContent = projectDescription.value;

    const newProject = document.createElement("div");
    newProject.classList.add("project");
    newProject.textContent = projectName.value;

    newProject.addEventListener("click", (e) => {
      currentProject = e.target.textContent;
      cleanTasks();

      const activeProject = projectsArray.find(
        (project) => project.name === e.target.textContent
      );
      headingProjectName.textContent = activeProject.name;
      headingProjectDescription.textContent = activeProject.description;

      activeProject.todos.forEach((todo) => {
        createTaskDOM(todo.name, todo.dueDate);
      });

      const projects = document.querySelectorAll(".project");
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        project.classList.remove("active");
      }
      e.target.classList.add("active");
    });

    const projects = document.querySelectorAll(".project");
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      project.classList.remove("active");
    }
    newProject.classList.add("active");

    projectList.append(newProject);

    sendToLocalStorage(projectsArray);
  });

  taskForm.addEventListener("submit", () => {
    const task = new Todo(
      taskName.value,
      taskDescription.value,
      false,
      taskDueDate.value
    );
    const activeProject = projectsArray.find(
      (project) => project.name === currentProject
    );
    const spliceIndex = projectsArray.indexOf(activeProject);

    activeProject.todos.push(task);

    projectsArray.splice(spliceIndex, 1);

    projectsArray.push(activeProject);
    console.log(projectsArray);

    createTaskDOM(taskName.value, taskDueDate.value);

    sendToLocalStorage(projectsArray);
  });
}

function createTaskDOM(name, dueDate) {
  console.log('runnign1');
  const newTask = document.createElement("div");

  const taskLeft = document.createElement("div");

  const inputCheckbox = document.createElement("input");
  inputCheckbox.type = "checkbox";
  inputCheckbox.id = "wp-comment-cookies-consent";
  inputCheckbox.name = "wp-comment-cookies-consent";
  inputCheckbox.value = "yes";

  const taskHeading = document.createElement("h4");
  taskHeading.textContent = name;

  const dueDatePara = document.createElement("p");
  dueDatePara.textContent = format(new Date(dueDate), "eeee, MMMM do");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-task-btn");
  deleteButton.dataset.task = name;

  deleteButton.addEventListener("click", (e) => {
    const activeProject = projectsArray.find(
      (project) => project.name === currentProject
    );
    const spliceIndex = activeProject.todos.findIndex(
      (todo) => todo.name === deleteButton.dataset.task
    );

    activeProject.todos.splice(spliceIndex, 1);

    const activeProjectIndex = projectsArray.indexOf(activeProject);
    projectsArray.splice(activeProjectIndex, 1);

    projectsArray.push(activeProject);

    taskList.removeChild(newTask);

    sendToLocalStorage(projectsArray);
  });

  const deleteImageIcon = document.createElement("img");
  deleteImageIcon.classList.add("delete-image-icon");
  deleteImageIcon.src = "./delete-task.svg";

  deleteButton.append(deleteImageIcon);

  newTask.classList.add("task");
  taskLeft.classList.add("task-left");

  taskLeft.append(inputCheckbox, taskHeading);

  newTask.append(taskLeft, dueDatePara, deleteButton);

  taskList.append(newTask);
}

export function initialLoad(projectsArray) {
  if (projectsArray.length === 0) return;

  projectsArray.forEach((project) => {
    const newProject = document.createElement("div");
    newProject.classList.add("project");
    newProject.textContent = project.name;

    projectList.append(newProject);
    
    newProject.addEventListener("click", (e) => {
      currentProject = e.target.textContent;
      cleanTasks();

      const activeProject = projectsArray.find(
        (project) => project.name === e.target.textContent
      );
      headingProjectName.textContent = activeProject.name;
      headingProjectDescription.textContent = activeProject.description;

      activeProject.todos.forEach((todo) => {
        createTaskDOM(todo.name, todo.dueDate);
      });

      const projects = document.querySelectorAll(".project");
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        project.classList.remove("active");
      }
      e.target.classList.add("active");
    });
  });
}

function sendToLocalStorage(array) {
  localStorage.setItem("PROJECT_ARRAY", JSON.stringify(array));
}

export function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("PROJECT_ARRAY"));
}

function cleanTasks() {
  taskList.replaceChildren();
}
