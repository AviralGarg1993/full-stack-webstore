<<<<<<< HEAD
# Assignment 4

## Please run 'npm install' and 'heroku local web'

This is a continuation of [Assignment 3](https://github.com/jungkumseok/cpen400a-fall2017-assignment3). As a part of this assignment, you will focus on interacting with the remote server (https://cpen400a-bookstore.herokuapp.com/products) to fetch the product items. You will need to build on your previous code - no code will be provided by us for this assignment.

The following URLs are available on the server:

* `https://cpen400a-bookstore.herokuapp.com/products` - object containing all the products
* `https://cpen400a-bookstore.herokuapp.com/products/${productName}` - returns a single product identified by `productName` 

## Tasks

1. **Write a reusable function that can be used for making AJAX calls:** (3 points) [jQuery](http://jquery.com) has a `$.get(url, callback)` function, which can be used to make XMLHttpRequests to servers and get back data. For this task you will be writing a similar function with the following signature: `ajaxGet(url, successCallback, errorCallback)`. The argument `url` would be a string representing the URL that we wish to make request to. `successCallback` would be a function that is called if the request was successful, and it takes in a single argument - the response returned from the server. In your `httpGet` function, you can choose to either pass the raw response to `successCallback`, or just the data - it's up to you. The `errorCallback` would be a function that is called if the request failed, and it also takes in a single argument - the error of the request. You should be able to use the function like this:
```
ajaxGet("https://cpen400a-bookstore.herokuapp.com/products",
	function(response){
		// do something with the response
	},
	function(error){
		// do something with the error
	}
	);
```
To help you get started, here is [some reference to the XMLHttpRequest API](https://www.w3schools.com/xml/xml_http.asp).
[Hurl.it](https://www.hurl.it) is a useful tool you can use if you want to make the requests manually from the browser and inspect the response, it will display a nicely indented response.
Of course, you can also use `curl` from terminal if you don't mind the raw string response.

2. **Fetch products from server to initialize the `products` variable:** (2 points) You will initialize your `products` variable by making an AJAX call to the following url. The `cart` variable should follow the same structure as the previous assignments - you should not make any changes to it. When calculating the total price of the products in the cart, use the price information from the products object as in the previous assignments. You can use the function from task 1 to make the AJAX request.
For example:
```
ajaxGet("https://cpen400a-bookstore.herokuapp.com/products",
	function(response){
		// initialize products
	},
	function(error){
		// handle error
	}
	);
```
Note that you don't have to pass in the callback functions in the raw format shown above - you can also declare a "initialize" function somewhere and pass the reference to it. We leave that up to you.
If you want, you can modify the `Product` object from assignment-3 to include `"quantity"` as a property and use it. But you are not required to use this object, if you wish not to. 

3. **Handle Timeout / Error:** (3 points) The remote server you are fetching the data from is not very reliable. Sometimes, instead of returning the product list the server takes a long time, which causes the AJAX request to time out. Also, sometimes the server returns error 500 instead of the product list. In either case, you will need to make repeated AJAX calls until you get the list of products from the web server (you can give up after a reasonable number of such repeated tries).

4. **Synchronize the price / quantity before checkout:** (5 points) In your show cart modal you need to present the user with a checkout button.
    * A) When the user clicks on checkout, you will need to make sure that the products are still available in the back store and the prices are updated. You will do that by making another AJAX call to the same url. Therefore, when the user clicks on checkout, you will alert the user with the message showing that you are confirming the final total price as well as the availability.
    * B) If there is any price change, you will need to alert the user for each product for which the price changed.
    * C) For any of the selected products, if the quantity that the user ordered is not available any more, you will change the number of products in the cart to the now available quantity. You will also need to alert the user about the updated quantity as well.
    * D) The cart variable should also be updated to reflect the revised prices/quantity.

5. **Update Cart modal and show total price:** (2 points) Once you have the updated cart information (from task 4), you will need to update the cart information shown to the user. Also, you will alert the user with the total amount due (based on the cart's contents).


## Bonus Task
(1 point) The code for the server used for the server side application, is made available at https://github.com/jungkumseok/cpen400a-fall2017-server. The instructions to run the server locally are available in the README file.
You need to have the server up and running in your local machine as well as you will need to host the same application on Heroku servers. You can create a free account to deploy this application. The task is only considered complete, if you have it setup on your local machine as well as on Heroku. The instructions to run on local machine are provided in the read me file. For deploying to Heroku, please follow the instructions given on their website. **Please include a link to your heroku deployment in your README file.**


## Code Quality & Scalability

(3 points) You should ensure that your JavaScript code follows the best practices around variable/function naming, variable placement, modularization (dividing long code blocks into smaller functions) and comments (your comments should explain why a design choice was taken, instead of how your code works). You still need to consider creating DOM elements programmatically (from Assignment 2 onwards) rather than hard-coding them in your HTML if you did not in your previous assignments. Additionally, HTML DOM elements should not be hard-coded as strings in JavaScript either. Your code will be assessed for code quality during marking.


## Submission instructions:

* Create a branch called `assignment-4`.
* Update the code to reflect the changes for this assignment.
* Make sure you commit and push your changes before the due date - late submissions will not be accepted.

### Deadlines:

These deadlines will be strictly enforced; we won't be looking at any commits done after this time-stamp.

* L1A & L1B - Tuesday, November 7, 2017 23:59:59 PST
=======
# Assignment1
You are hired as a web developer for UBC bookstore to develop a website to sell their products online. As a part of your job you are going to build an online store where you can list different items that can be sold online. Students can register on the website, browse all the available products, check out availability, read product description and purchase any of the listed items.

To help you get started, you will need to structure your project into the following way for the assignments. **Submission instructions are given in the end of this document.**

* Root folder <all html files go in this folder>
  * css
    * (all stylesheets go in this folder)
  * js
    * (all JavaScript files go in this folder)
  * images
    * (all images go in this folder)
  * index.html (this should be the entry point to your website)
  
As a part of this assignment, you will need to build the homepage for the online store. In the screenshot **layout.png**, we provide you with the wireframe of how the web page should look. You are free to choose colours and fonts of your own choice.

**Marking**: There are 3 tasks for this assignment:
* Task 1: 2 Points
* Task 2: 2 Points
* Task 3
  * A - 3 Points
  * B - 3 Points

**For this assignment, you will be using HTML and CSS to define the layout of a web page and apply styles to different DOM elements. There is no JavaScript required for this assignment, so you will be penalized if you use JavaScript for this assignment.**

**Tasks**
* Create the html layout that will be required to generate the web page provided in the screenshot. Your homepage should include the following elements:
  * Header (id=header)
    * Logo (id=logo)
    * Welcome Banner (id=welcomeBanner)
  * Main Content (id=mainContent)
    * Navigation Menu (id=navigationMenu)
    * Product List (id=productList)
      * product 1 (class=product)
      * product 2 (class=product)
      * product n (class=product)
      * **You can find all the product images, with the product name and price (in the image name) that you will be displaying on the home page.**
  * Footer (id=footer)
* Create a CSS stylesheet to add relevant styles that would help you design the layout for the web page. A few things to keep in mind:
  * The width of the content within the website should be 1000px.
  * The content should be centered within the web page.

* You need to add some interactivity to the website using pure css (no javascript is required for these tasks, so please do not use JavaScript)
  * When you hover over any of the items in the navigation menu, the text and background color should be changed. As soon as you move the mouse pointer away, the color should be restored back to the original color.
  * When you hover over over any of the product, there should be a gray background visible around the product, as well as the product price becomes visible on top of the product image. As soon as you take the mouse pointer away, the price and the gray background should disappear.



**To test you code, insert the following script tags within the head tag of your page**
```
<script src="http://ece.ubc.ca/~kbajaj/cpen400a/jquery.js" type="text/javascript"></script>
<script src="http://ece.ubc.ca/~kbajaj/cpen400a/test1.js" type="text/javascript"></script>
```
You will see a Red button on the top-right corner of your web page. Clicking on that will let you test your code.

Below you can find the list of products, along with the images and their price that you will be displaying within your website. You will need to save each of these images into the image folder for use.

Note that you do not need to setup any server to host the webpage you are creating. Simple open the html pape with any browser, the webpage will be displayed.


**Submission instructions:**
* For each assignment, create a branch called assignment-<number>, for ex: assignment-1, assignment-2, * etc.
* Make sure you push your changes to that branch before midnight (11:59 PM) on the date of the assignment deadline - late submissions will not be accepted.
* We will be downloading the code on the midnight of the due date, any changes to code after that point will not be considered for marking.

 
>>>>>>> 09d1d7d0d95fe1cb7790c367cdb229a25d3494ea
