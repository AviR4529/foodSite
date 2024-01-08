const answer = document.getElementById("answer");
const elementsDiv = document.getElementById("elementsDiv");
const searchButton = document.getElementById("searchButton");
const theInput = document.getElementById("theInput");
const shoping_list_div = document.getElementById("shoping_list_div");

let theData;
let currentServings = 0;
let currentAmount = 0;

//פונקציה להצגת פרטי המתכון הנבחר
function recipeDetailsShow(id) {

  //ניקוי הדיב
  elementsDiv.innerHTML = "";

  //קבלת פרטי המתכון מהשרת
  fetch("https://api.spoonacular.com/recipes/" + id + "/information?apiKey=c334e8eb6e784f90ab845d38fd6a014a")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      theData = data;
      console.log(theData);

      //כותרת המתכון
      const titleOfRecipe = document.createElement("h2");
      titleOfRecipe.innerHTML = data.title;
      elementsDiv.appendChild(titleOfRecipe);

      //תמונה ראשית
      const mainImage = document.createElement("img");
      mainImage.src = data.image;
      mainImage.id = "bigImage";
      elementsDiv.appendChild(mainImage);

      //זמן הכנה
      const preparationTime = document.createElement("p");
      preparationTime.id = "preparationTimeID";
      preparationTime.innerHTML = "Preparation time (minutes): " + data.readyInMinutes;
      elementsDiv.appendChild(preparationTime);

      //דיב של כמות הסועדים
      const divOfServings = document.createElement("div");
      divOfServings.id = "divOfServingsID";
      elementsDiv.appendChild(divOfServings);

      //כפתור הפחתה של כמות סועדים
      const minusServingsButton = document.createElement("button");
      minusServingsButton.id = "minusServingsButtonID";
      minusServingsButton.textContent = "-";
      divOfServings.appendChild(minusServingsButton);

      //טקסט של כמות הסועדים
      const servings = document.createElement("p");
      currentServings = data.servings;
      servings.innerHTML = "servings: " + currentServings;
      divOfServings.appendChild(servings);

      //כפתור הוספה של כמות סועדים
      const plusServingsButton = document.createElement("button");
      plusServingsButton.id = "plusServingsButtonID";
      plusServingsButton.textContent = "+";
      divOfServings.appendChild(plusServingsButton);

      //האזנה לאירוע לחיצה של כפתור הוספת סועדים
      plusServingsButton.addEventListener("click", function () {
        currentServings = plusServingsFun(currentServings);
        servings.innerHTML = "servings: " + currentServings;
      });
      //האזנה לאירוע לחיצה של כפתור הפחתת סועדים
      minusServingsButton.addEventListener("click", function () {
        currentServings = minusServingsFun(currentServings);
        servings.innerHTML = "servings: " + currentServings;
      });

      //יצירת דיב עבור הרכיבים
      const divOfIngredients = document.createElement("div");
      divOfIngredients.id = "divOfIngredientsID";
      const Ingredients = document.createElement("p");
      Ingredients.id = "IngredientsID";
      Ingredients.innerHTML = "<b> Ingredients: </b> <br>";

      //הדפסה של הרכיבים
      data.extendedIngredients.forEach(result => {
        currentAmount.push = result.amount;
        Ingredients.innerHTML += result.amount + " " + result.unit + " " + result.originalName + "<br>";
      })
      divOfIngredients.appendChild(Ingredients);
      elementsDiv.appendChild(divOfIngredients);


      //פונקציה להוספת הטקסט של סועדים
      function plusServingsFun(servings) {
        servings += 1;
        updateIngredients(servings);
        return servings;
      }

      //פונקציה להפחתת הטקסט של סועדים
      function minusServingsFun(servings) {
        if (servings > 1) {
          servings -= 1;
          updateIngredients(servings);
        }
        else {
          alert("At least one diner is required for the recipe");
        }
        return servings;
      }

      //פונקציה לעדכון כמות הרכיבים בהתאם לסועדים
      function updateIngredients(servings) {
        const ingredientsEl = document.getElementById("IngredientsID");
        ingredientsEl.innerHTML = "Ingredients: <br>";
        
        //הדפסה מחדש של הרכיבים המעודכנים
        theData.extendedIngredients.forEach(result => {
          const newAmount = (result.amount / data.servings) * servings;
          if (Number.isInteger(newAmount))
            ingredientsEl.innerHTML += newAmount + " " + result.unit + " " + result.originalName + "<br>";
          else {
            ingredientsEl.innerHTML += newAmount.toFixed(3) + " " + result.unit + " " + result.originalName + "<br>";
          }
          result.amount = newAmount;
        });
      }
      // בקשה לשרת עבור רמת הטעם של המתכון
      fetch("https://api.spoonacular.com/recipes/" + id + "/tasteWidget.json?apiKey=c334e8eb6e784f90ab845d38fd6a014a")
        .then(response => response.json())
        .then(data => {
          console.log(data);

          //הדפסה של רמות הטעם של המתכון
          let textOfTaste = document.createElement("p");
          for (let key in data) {
            if (data.hasOwnProperty(key)) {
              let textNode = document.createTextNode(`${key}: ${data[key]} ${"😜"}`);
              textOfTaste.appendChild(textNode);
              let lineBreak = document.createElement("br");
              textOfTaste.appendChild(lineBreak);
            }
          }
          elementsDiv.appendChild(textOfTaste);

          //כפתור שפותח את הוראות הכנה
          const InstructionsButton = document.createElement("button");
          InstructionsButton.textContent = "Directions";
          elementsDiv.appendChild(InstructionsButton);
          InstructionsButton.id = "InstructionsButtonID";
          InstructionsButton.addEventListener("click", function () {
            const instructionsWindow = window.open(theData.spoonacularSourceUrl, "_blank");
          });

        })
        .catch(error => {
          alert("error: " + error);
        });

      //כפתור הוספה לרשימת קניות
      const add_to_shoping_list_button = document.createElement("button");
      add_to_shoping_list_button.id = "add_to_shoping_list_id";
      add_to_shoping_list_button.innerText = "Add to shoping list";
      elementsDiv.appendChild(add_to_shoping_list_button);

      //פונקציה להוספת רשימת הקניות
      add_to_shoping_list_button.onclick = function () {
        add_to_shoping_list_Fun(theData);
      };

      const lineBreak1 = document.createElement("br");
      elementsDiv.appendChild(lineBreak1);

       //רמת הבריאות של המתכון
       const healthScore = document.createElement("p");
       healthScore.innerHTML = "health Score: " + data.healthScore;
       elementsDiv.appendChild(healthScore);



    })
    .catch(error => {
      alert("error " + error);
    });

}

//פונקציה לביצוע חיפוש המתכונים
function searchFun() {
  elementsDiv.innerHTML = "";
  let querySearch = theInput.value;

  //בקשה לשרת עבור חיפוש המתכונים
  fetch('https://api.spoonacular.com/recipes/complexSearch?apiKey=c334e8eb6e784f90ab845d38fd6a014a&query=' + querySearch)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      let html = "";

      //הדפסה של תוצאות החיפוש
      data.results.forEach(result => {
        const newDivID = document.createElement("div");
        newDivID.id = "newDivID";
        newDivID.innerHTML = `
      <img id="images" src="${result.image}" alt="${result.title}" width="30" height="30">
      <p id="textR" onclick="recipeDetailsShow(${result.id})">${result.title}</p>
    `;
        html += newDivID.outerHTML;
        answer.appendChild(newDivID);

      });

      //טיפול במקרה קצה שבו אין תוצאות חיפוש
      if (data.results.length == 0) {
        html = "<h1>- No recipes found!</h1>";
        answer.innerHTML = html;
      }
      else {
        answer.innerHTML = html;
      }

    })
    .catch(error => {
      alert("error! the search not working! - " + error);
    });
}

//פונקציה להוספת רשימת קניות
function add_to_shoping_list_Fun(data) {
  shoping_list_div.innerHTML = "<h2>My Shoping List</h2>";
  data.extendedIngredients.forEach(result => {
    const shoping_list_Ingredients_div = document.createElement("div");
    shoping_list_Ingredients_div.id = "shoping_list_Ingredients_div_id";
    shoping_list_Ingredients_div.innerHTML = `
      <button id="removeIngredientID">X</button>
      <input type="number" id="quantity" value="${result.amount}" step="1" min="0">
      <p id="textList">${result.originalName}</p>
    `;

    //כפתור מחיקה לרכיב מתוך רשימת הקניות
    const removeIngredientButton = shoping_list_Ingredients_div.querySelector("#removeIngredientID");
    removeIngredientButton.addEventListener('click', () => {
      removeIngredientButton.parentElement.remove();
    });
    shoping_list_div.appendChild(shoping_list_Ingredients_div);
  })
}

searchButton.addEventListener('click', searchFun);
