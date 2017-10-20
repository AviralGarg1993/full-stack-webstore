# Assignment3

This is a continuation of [Assignment 2](https://github.com/jungkumseok/cpen400a-fall2017-assignment2). As a part of this assignment, you will focus on implementing a dynamic cart interface for the user.

## Tasks

1. **Create a Product constructor** (4 Points)
* A) Write a function with the signature `Product(name, price, imageUrl)`, which will be used to create instances of `Product` objects. The created object should have the properties `name`, `price`, and `imageUrl` that will be initialized with the arguments `(name, price, imageUrl)` given into the constructor function. You should be able to create a new `Product` object using this function like this:
    
```
var box1 = new Product('Box1', 10, 'images/products/Box1_$10.png');
console.log( box1.name ); // Should print "Box1" to the console.
```

* B) Write a prototype function of `Product` with the signature `computeNetPrice(quantity)`, which takes in a single number `quantity` as an argument and returns price of the product multiplied by the given quantity. Example:

```
//Using box1 from the example from Part 1A
console.log( box1.computeNetPrice(5) ); // Should print '50' to the console.
``` 

This function will be useful in Part 3 and Part 5 for computing the total price in the cart.


2. **Update `products` to use instances of `Product`:** (1 point) Modify your `products` variable to store instances of products along with the quantity (earlier you had only the quantity). You can use following data structure for `products`. 
```
var products = {
    'productName1' : {
      'product' : new Product('productName1', 10, 'images/products/productName1_$10.png'),
      'quantity' : 5
    },
    'productName2' : {
      'product' : new Product('productName2', 15, 'images/products/productName2_$15.png'),
      'quantity' : 5
    },
    ...
};
```
  You **do not** need to keep the product instances in the `cart` as that information is already there in the `products` object. When calculating the total price of the products in the cart, you can use the price information from the `Product` instances. Please feel free to assign prices to products as you like (you do not have to use prices given in the image URL).


3. **Cart Price / Timeout:** (3 points) On the top right corner of your website, show a button with text **Cart ($0)**. Here $0 represent the total price for the products in the cart. When the end-user clicks on **Add** button for any product, the cart variable needs to be updated and the button should be updated to display the new total price. Use the `products` variable when calculating the total price of products in the cart. You also need to display the **inactiveTime** from the previous assignment within the website footer. You can change the inactive time to **300s** now. The footer should be updated every second to reflect the time that the user has been inactive. *Please note that viewing the cart is also considered a user action.*


4. **Conditionally Hide Add and Remove Buttons:** (2 points) By default, when there is no product in the cart, when the user hovers over the product there should only be the **Add** button visible. **Remove** button for any product should only be visible when there is at least one of that product in the cart. If a product is out of stock (i.e. quantity == 0 in products), the **Add** button should be hidden and a friendly message should be displayed to indicate that the item is out of stock.


5. **Show Cart:** (4 points) When clicking on the  **Cart ($0)** button, the user should be presented with a Modal, that looks like [this](http://maxcdn.webappers.com/img/2011/03/css-modal.png). The modal should perform the following functionality
  - The modal should appear in the center of the window, with a transparent black background around the modal.
  - The modal should have a button to close the link in the top right corner, as shown in the link.
  - The modal should present the user with the list of products in the cart, quantity of each product and total price and a tabular manner within the modal.
  - You also need to show **+/-** buttons in the table in the modal. Clicking on these buttons should increment/decrement the quantity of products in the cart. You can hook on to `addToCart` and `removeFromCart` functions, as they were already incrementing/decrementing the products in the cart.
  - If the quantity of the product reaches 0, you need to remove it completely from the tabular display in the modal.
  - The bottom of the modal should have a button called **Checkout**. Functionality for this button will be implemented in the next assignment.

## Bonus Task

(1 point) When the cart modal is open, if the user presses **esc**, you need to hide the modal.

## Code Quality

(3 points) You should ensure that your JavaScript code follows the best practices around variable/function naming, variable placement, modularization (dividing long code blocks into smaller functions) and comments (your comments should explain why a design choice was taken, instead of how). Your code will be assessed for code quality during marking.

## Scalability

(3 points)
There are multiple ways to go about implementing the tasks specified in this assignment. However, you should consider the scalability/robustness of your implementation. As an example, you should consider creating DOM elements programmatically (from Assignment 2 onwards) rather than hardcoding them in your HTML. Software designs that lead to "copy and paste programming" will be discouraged.

## Submission instructions:

* Create a branch called `assignment-3`.
* Update the code to reflect the changes for this assignment.
* Make sure you commit and push your changes before the due date - late submissions will not be accepted.

### Deadlines:

These deadlines will be strictly enforced; we won't be looking at any commits done after this time-stamp.

* L1A & L1B - Tuesday, October 24, 2017 23:59:59 PST

## Labs are mandatory on the week of assignment submission:

* If you cannot attend the lab to demo your assignment for any reason, you need to notice Instructors on Piazza ahead of at least 24 hours before the lab section starts. Otherwise, you will be recorded as no attendance and will have marks deducted.