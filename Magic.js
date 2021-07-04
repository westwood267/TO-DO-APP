// Global Variables

var signInButton = document.getElementById("sign-up");
var logInButton = document.getElementById("log-in");
var signInForm = document.getElementById("sign-up-form");
var logInForm = document.getElementById("log-in-form");
var userName = document.getElementById("sign-up-name");
var userLastName = document.getElementById("sign-up-last-name");
var userEmail = document.getElementById("sign-up-email");
var userPassword = document.getElementById("sign-up-password");
var userAgreement = document.getElementById("terms-conditions");
var signUpDone = document.getElementById("sign-up-done");
var errorMessage = document.getElementById("error-message");
var logInDone = document.getElementById("log-in-done");
var logInEmail = document.getElementById("log-in-email");
var logInPassword = document.getElementById("log-in-password");
var loginError = document.getElementById("login-error-message");
var dashboard = document.getElementById("dashboard");
var registration = document.getElementById("registration");
var taskButton = document.getElementById("task-creator-button");
var taskTitle = document.getElementById("task-creator");
var taskList = document.getElementById("my-tasks");
var addListItemButton = document.getElementById("add-list-item");
var listItem = document.getElementById("list-item"); 
var activeTask = document.getElementById("active-task");
var taskContent = document.getElementById("task-items");
var options = document.getElementById("options");
var subMenu = document.getElementById("options-menu");
var accountDetails = document.getElementById("account-details");
var accountDetailsForm = document.getElementById("account-details-form");
var accountName = document.getElementById("account-name");
var accountSurname = document.getElementById("account-last-name");
var accountEmail = document.getElementById("account-email");
var accountPassword = document.getElementById("account-password");
var accountError = document.getElementById("account-details-error");
var newPassword = document.getElementById("new-account-password");
var signOut = document.getElementById("sign-out");

var currentUser;
var currentList;
var loggedIn = false;

// End of Global Varialbes

//Methods


//Display Sign In Form 
//(this will toggle the log in form)

//This method will display the sign up form when the sign up button is clicked
//But first we will attach an event listener to the button

signInButton.addEventListener('focusin',displaySignInForm)

function displaySignInForm()
    {
        signInForm.style.display = "block";
        logInForm.style.display = "none";
    }

//Display Log in form 
//(this will toggle the sign up form)

//This method will display the log in form but as you guessed we first need an
//event listener attached to the log in button

logInButton.addEventListener('focusin', displayLogInForm)

function displayLogInForm()
    {
        logInForm.style.display = "block";
        signInForm.style.display = "none";
    }


//Sign Up Form Validation
//Once the user clicks the done button at the bottom of the sign up form we need to validate the inputs

signUpDone.addEventListener("focusin",validateSignUpForm)

function validateSignUpForm()
    {
        //we will check if input fields aren't blank and if everything is in order we will proceed
        //and create a user account otherwise an error message will be displayed

        console.log("Validating user input")
        if(userAgreement.checked && userEmail.value && userLastName.value && userName.value && userPassword.value)
            {
                currentUser = userEmail.value;
                createUser();
                errorMessage.innerText = "";
            }

        else
            {
                console.log("Error : Form is not completed")
               errorMessage.innerText = "Fill in the form completely";
            }
    }

function createUser()
    {
        //Each user account is created with an empty array that will hold all the tasks they create
        //each task is the key to the local storage item containing the actual list of to do items for that particular task 
        console.log(`Creating user account for ${userEmail.value}`)
        let userAccount = {name:userName.value , surname: userLastName.value, email: userEmail.value, password: userPassword.value, tasks: []};
        console.log(userAccount);

        //From there we will stringify the user object in order to store it in local storage and to easily find it we will use the user's email adress
        //as the key for their user account in localStorage

        let userAccountSerialised = JSON.stringify(userAccount);
        localStorage.setItem(userEmail.value,  userAccountSerialised);

        console.log(`Succesfully created a user account for ${userEmail.value}`)
        console.log(localStorage);

        //once complete we can display their dashboard
        displayDashboard();

        //We also want to set the flag logged in to true
        loggedIn = true;
    }

//Log In Form Validation

//We will now create a method to validate and verify the log in information given to us by the user

logInDone.addEventListener('focusin',validateLogIn)

function validateLogIn()
    {
        //as always we'll first check if the user is submitting a blank form

        if(logInEmail.value && logInPassword.value)
            {
                loginError.innerText = "";
                let tempUserObject = JSON.parse(localStorage.getItem(logInEmail.value));

                
                if(tempUserObject == null)
                    {
                        loginError.innerText = "That Email Adress Is Not Registered";
                    }

                else if(logInPassword.value != tempUserObject.password)
                    {
                        loginError.innerText = "Passwords Do Not Match";
                    }

                else if(logInPassword.value == tempUserObject.password)
                    {
                        currentUser = logInEmail.value;
                        console.log(`Succesfully logged in as ${currentUser}`);
                        displayDashboard();
                        //We also want to set the flag logged in to true
                        loggedIn = true;
                    }
              
            }

        else
            {
                loginError.innerText = "Please fill in the form"
            }
    }

//Displaying the dashboard

function displayDashboard()
    {
        //first we will hide both forms and the registration bar
        
        logInForm.style.display = "none";
        signInForm.style.display = "none";
        registration.style.display = "none";

        //then we will make the dashboard visible
        dashboard.style.display = "grid";
        renderList();
        renderOptions();
    }

//A method to add tasks to MyTasks

taskButton.addEventListener('click', addTask)

function addTask()
    {
        //First we will fetch and parse the original user account object from local storge
        let userAccount = JSON.parse(localStorage.getItem(currentUser));

        //Then we will push the new task to the array
        userAccount.tasks.push(taskTitle.value);

        //Stringify the updated user objecy
        let updatedUserAccount = JSON.stringify(userAccount);

        //Remove the old user object from local storage
        localStorage.removeItem(currentUser);

        //Create a new user object with the updated list of tasks
        localStorage.setItem(currentUser, updatedUserAccount);

        //Confirmation message for deveolpers
        console.log(`This is the updated user account  ${localStorage.getItem(currentUser)}`);
        
        //Additionally we need an array to hold the content of this new to do list
        let taskContent = [];

        //We go on to seriealise the new array
        let taskContentSerialised = JSON.stringify(taskContent);

        //And finally we'll set the given input as the key for the array in local storage
        //So if the user wanted to create a new list called "Monday" we would create a new array
        //Serialise it and store it in local storage with the key "Monday";
        localStorage.setItem(taskTitle.value, taskContentSerialised);

        console.log(`Content of the list ${taskTitle.value} : ${localStorage.getItem(taskTitle.value)}`);


        //Also as a nice touch I want to empty the field after the user inputs data
        taskTitle.value = "";
        //Lastly we will render the updated list
        renderList();
    }

//A function to render the updated list of tasks
function renderList()
    {
        //First we have to clear the outdated list
        clear();

        //Then we fetch and parse the list of tasks from local storage
        let userObject = JSON.parse(localStorage.getItem(currentUser));

        //Using a foreach loop we will appened each list item to the unorderd list myTasks
        let tasks = userObject.tasks
        tasks.forEach(element => {

            let listItem = document.createElement("li");

            listItem.innerText = element;

            listItem.addEventListener('click', changeList)

            taskList.appendChild(listItem);
        });

    }

//The purpose of this function is simple, clear the list My Task 
function clear()
    {
        taskList.innerText = "";   
    }

function toDoClear()
    {
        taskContent.innerText = "";
    }

//This function will allow us to navigate between lists

function changeList(e)
    {
     
        //This line of code allows us to capture the name of the list item the user selected
        currentList= (e.target.innerText);

        console.log(`Currently viewing list: ${currentList}`);

        //This changes the header of the active task to the name of the list the user selected
        activeTask.innerText = currentList;

        renderListContent();
    }

    //This function renders the content of each to do list
    function renderListContent()
        {
              
        toDoClear();
        console.log("Rendering list: " + currentList)
        //First we will fetch the actual list from local storage 
        //This is easy because we matched the key of the list to the title of the tasks' name
        let taskItems = JSON.parse(localStorage.getItem(currentList));

        //Using a for each loop we will create an li for each item in the to do list and then appened it to the list
        taskItems.forEach(element => {

            let toDoItem = document.createElement("li");

            toDoItem.addEventListener('click', itemComplete);

            toDoItem.innerText = element;

            taskContent.appendChild(toDoItem);
        });
        }

    //This fucntion will alow the user to check off an item as done, simply by clicking on it

    function itemComplete(e)
        {
            if(e.target.classList == "")
                {
                    e.target.classList.add("done")
                }

            else
                {
                    e.target.classList.remove("done")
                }
            
        }



//This event listener will listen for the user clicking on the update task content button which will add an item to the todo list
    addListItemButton.addEventListener('click', updateTaskContent)

//This function will add the text in the "list-item" input field to the user's to do list

    function updateTaskContent()
        {
            console.log(`Updating the current to do list: ${currentList}`)

            //We will fetch and parse the array holding the to do items from local storage
            let currentTaskContent = JSON.parse(localStorage.getItem(currentList));


            currentTaskContent.push(listItem.value);
            let updatedTaskContent = JSON.stringify(currentTaskContent);
            localStorage.removeItem(currentList);
            localStorage.setItem(currentList,updatedTaskContent);
            console.log(`This is the updated version of ${currentList} ${localStorage.getItem(currentList)}`);
            listItem.value = "";
            renderListContent();
        }



//Adding an event listener to the options button so that whenever the user clicks it it renders a sub-menu

options.addEventListener('focusin',renderSubMenu)
// options.addEventListener('focusout',hideSubMenu)

function renderOptions()
    {
        options.style.display = "block"
    }

function renderSubMenu()
    {
                subMenu.style.display = "flex";
    }

function hideSubMenu()
    {
                subMenu.style.display = "none";
    }

//Adding an event listener to the account settings button so if clicked by the user it will display a form 
//which allows the user to edit their account details

accountDetails.addEventListener('click',renderAccountDetails)

function renderAccountDetails()
    {
        console.log("Rendering account details")
        //We will hide the dashboard
        dashboard.style.display = "none";

        //We will also hide the sub menu

        subMenu.style.display = "none";

        //we will then render the account details form
        accountDetailsForm.style.display = "block";

        //from there we will call a function that will fill in the form with previously entered data
        fillAccountDetails();
    }


//This function will fill in their old account details 
function fillAccountDetails()
    {
        console.log(`Parsing account details for ${currentUser}`);
        //First we will fetch and parse the old account information
        let oldAccountDetails = JSON.parse(localStorage.getItem(currentUser));

        //Then we will update the form with the old information except for the account password
        //We will need the user to enter their old password so we know it's them
        accountEmail.value = oldAccountDetails.email;
        accountName.value = oldAccountDetails.name;
        accountSurname.value = oldAccountDetails.surname;
    }

//Once the user is done editing their account details this function will update their account in local storage
//My method is simple, I haven't found a localStorage.update() method which would save me a lot of time 
// So my work around is to fetch the account object, parse, update the information and store it in a new variable called updatedAccount
//from there we will delete the old user account from localStorage and replace it with the updated userAccount 

function updateAccountDetails()
    {

        let oldUserAccount = JSON.parse(localStorage.getItem(currentUser));

        console.log("Validating the old password")

        if(accountPassword.value == oldUserAccount.password)
            {
                console.log("Passwords match");
                console.log("Updating account details");
                let updatedUserAccount = {name : accountName.value, surname : accountSurname.value, email : accountEmail.value, password: newPassword.value, tasks : oldUserAccount.tasks};
                let uSAS = JSON.stringify(updatedUserAccount);
                console.log("This is the updated user account " + uSAS);
                localStorage.removeItem(currentUser);
                localStorage.setItem(accountEmail.value , uSAS);
                accountError.innerText = "";
            }

        else
            {
                accountError.innerText = "Passwords do not match";
                console.log("Passwords do not match");
            }
        
    

    }

//We will now implement a method to rename the to do list
//To achieve this 2 things have to be done, first of all the array list containing the user's to do list items has to be renamed
//Secondly the name of the tasks[] element that is pointing to that renamed array list has to be updated.
//To rephrase my self, I stored the user's to do list as an array in local storage for example "Monday:["Wake up @ 8:30", "Go to work"]"and each user account has an array of that holds
//the keys to all their to do lists in localStorgae called tasks "tasks : ["Monday"]". So we have to rename the array holding the to do list items and the key that is 
//kept in their user account.

activeTask.addEventListener('click',renameList)

function renameList(e)
    {
        /*This is step 1 copying the old to do list and pasting it in a new array with the updated name */

        let thisList = e.target.innerText;

        let reply = prompt("What would like to save this list as?");

        console.log(`The user would like to rename ${thisList} to ${reply}`)

        let renamedList = JSON.parse(localStorage.getItem(thisList))

        localStorage.removeItem(thisList);

        let renamedListStringify = JSON.stringify(renamedList);

        localStorage.setItem(reply, renamedListStringify)

        console.log(`Finished creating the new to do list ${reply}`)

        /*This is step 2 updating the user object to accomodate the update list */

        let userAccount = JSON.parse(localStorage.getItem(currentUser));

        

        let oldTasks = userAccount.tasks;
        let newTasks = [];

        oldTasks.forEach(task => {
            if(task != thisList)
                {
                    newTasks.push(task)
                }

            else
                {
                    newTasks.push(reply);
                }
        })

        var updatedAccount = {name: userAccount.name , surname: userAccount.surname, email: userAccount.email, password: userAccount.password, tasks: newTasks};

        console.log("This is the updated user account with the renamed task")
        console.log(updatedAccount)

        let updatedAccountStringify = JSON.stringify(updatedAccount);

        localStorage.removeItem(currentUser);

        localStorage.setItem(currentUser, updatedAccountStringify);

        renderList();
    }

//Now we will be implementing the sign out option for the user

signOut.addEventListener('click', signUserOut)

function signUserOut()

    {
        //We will simply reload the page and "safely sign the user out in the background"
        document.location.reload();

        
    }


