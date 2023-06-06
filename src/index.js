import fetchFormData, {
  projectsArray,
  getFromLocalStorage,
  initialLoad,
} from "./dom.js";

const fetchedArray = getFromLocalStorage();

if (!fetchedArray) {
  projectsArray = [];
} else {
  projectsArray = fetchedArray;
}

initialLoad(projectsArray);

fetchFormData();
