///////////////////////////////TOOGLE BAR PROPERTY//////////////////////////////////////////

//Now first we have to apply ONBLUR  property to the toggle bar in mobile version
//THIS IS A jQUERY METHOD OF DOING THIS
$(function(){//Same as document.addEventListener(DOMContentLoaded,function())
//here the name if the jQuery function is $, cause the index is linked to it
//So, here we're executing a $ function
	


	//$ function also serves as a querySelector
	//Same as document.querySelector("#navbarToggle").addEventListener("blur", function())
	$("#navbar-toggle").click(function(event){//blur is the onblur property, then we'll initiate the function
	//So when the toggle button is pressed and cursor moves away
		var screenWidth = window.innerWidth;//which means it's the width of the browser
		if(screenWidth < 768) {//says if the screenwidth is less than 768 ie mobile version, where we have to target
			$("#collapsable-nav").collapse('hide');//then the dropdown menu will hide
		}//here we directly linked the id of dropdown menu
	});  
	// In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbar-toggle").click(function (event) {
    $(event.target).focus();
  });

});



///////////////////////////////////HOME PAGE MAIN CONTENT DYNAMIC ///////////////////////////
///////////////////////////////////MENU PAGE MAIN CONTENT DYNAMIC/////////////////////////


// Load the menu categories view

(function (global) {//First we make an Immediately Invoked Function

var dc = {};//Declare empty object variable directly


//Creating the paths to the directories and snippets
  var homeHtml = "snippets/home-snippet.html";//Put home url
  //FOR MENU CATEGORY PAGE
  var allCategoriesUrl =//Insert the url of the json library, from the server side app
    "https://davids-restaurant.herokuapp.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  //FOR MENU ITEMS PAGE
  var menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";



// Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {//AGAIN here, putting the snippet in the main page
      var targetElem = document.querySelector(selector);
      targetElem.innerHTML = html;
    };


//Put the  loasding icon into the snippet, then in a div box, then passing it in convienence function
// Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
      var html = "<div class='text-center'>";
      html += "<img src='images/ajax-loader.gif'></div>";
      insertHtml(selector, html);
    };



// Return substitute of '{{propName}}'
// with propValue in given 'string'
//Now we'll insert propertiesname and values into the string ie snippet
//We'll take the snippet and insert the propname and value innit
//This is for all the temporary variables, which change
    var insertProperty = function (string, propName, propValue) {
      var propToReplace = "{{" + propName + "}}";
      string = string
        .replace(new RegExp(propToReplace, "g"), propValue);
      return string;
    }




// REMMOVE THE CLASS ACTIVE FROM HOME AND SWITCH TO MENU BUTTON
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;//className means all the classes in this id
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") == -1) {//indexOf returns -1 if it doesn't the given string
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};  


 




// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {//Start this 

// On first load, show home view
showLoading("#main-content");//WE'LL START SHOWING THE LOADING IMAGE, WHILE AJAX GET REQUESTS
$ajaxUtils.sendGetRequest(      //function(requestUrl,responseHandler)
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;//INSERT THE SNIPPET WE GET
  },
  false);
});

// LOAD THE MENU CATEGORIES
dc.loadMenuCategories = function () {//NOW HERE WE'LL AJAX GET THE MENU CATEGORIES SNIPPET 
  showLoading("#main-content");//START LOADING AGAIN
  $ajaxUtils.sendGetRequest(//CALL FOR GET REQUEST   function(requestUrl,responseHandler)
    allCategoriesUrl,//Here is the url to our heroku app 
    buildAndShowCategoriesHTML);//CALL THE FUNCTION FOR MENU CATEGORIES CODE SNIPPETS
  //we have json script, but we won't use true, as it's default
};


// LOAD THE MENU ITEMS VIEW
// 'categoryShort' is a short_name for a category
dc.loadMenuItems = function (categoryShort) {//passing category type, depends one which cat we click
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort,//passing the url of the app directory + the category name for every particular loop
    buildAndShowMenuItemsHTML);//passing the function, which'll process the results
  //It's goin to be json so writing true is not required
};


// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHTML (categories) {
  //NOW HERE WE HAVE TO GET TWO GET REQUEST FROM TWO SNIPPETS
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(//FIRST GET REQUEST FOR TITLE
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(//SECOND GET REQUEST FOR MAIN DIV BOX
        categoryHtml,
        function (categoryHtml) {
          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);//PUT THE WHOLE THREE PROPERTIES IN PAGE
        },
        false);//NO JSON
    },
    false);//NO JSON
}



// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";//BOOTSTRAPIN

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}





// Builds HTML for the single category page based on the data
// from the server
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  //cat egoryMenuItems is going to be an object,that's goin to get returned as json gets processed
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}


////////BUILDANDSHOW FOR SINGLE CATEGORY///////////////////
// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);

    // Add clearfix after every second menu item
    if (i % 2 != 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Appends price with '$' if price exists
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}



global.$dc = dc;

})(window);




















