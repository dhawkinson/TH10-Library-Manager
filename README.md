# fsjsProject10 - Library Manager

##A library management app with sqlite3 db,  the Sequelize ORM and the Express framework

**To complete this project, follow the instructions below. If you get stuck, ask a question in the community.**

##Models: 

The library.db file should contain 3 tables. Create a Sequelize model for a books table, a patrons table, and a loans table. 

###There are no timestamps.

* [x] The books table should have the following columns:
  * id (integer)
  * title (string),
  * author (string)
  * genre (string)
  * first_published an integer

* [x] The patrons table should have the following columns: 
  * id (integer)
  * first_name (string)
  * last_name (string)
  * address (string)
  * email (string)
  * library_id (string)
  * zip_code (integer)

* [x] The loans table should have the following columns: 
  * id (integer)
  * book_id (integer)
  * patron_id (integer)
  * loaned_on (date)
  * return_by (date)
  * returned_on (date)

##Home Screen:

As a librarian, I should have a home screen so I can access functionality easily with a single click. See home.html for an example. 

###The home screen should include links to all of the following pages:

* [X] Books:
  * [x] New Book
  * [x] List All
  * [x] List Overdue
  * [x] List Checked Out
* [X] Patrons:
  * [x] New Patron
  * [x] List All
* [X] Loans
  * [x] New Loan
  * [x] List All
  * [x] List Overdue
  * [x] List Checked Out

**NOTE:** [x] You should use Pug to render your views for this project. 

*** Avoid *** [x] using a front end framework such as Angular.js.

##Navigation: 

As a librarian, I should be able to access a main navigation menu from every page of my application. The navigation should include links to the: 
* [X] Books Listing page (*all_books.html*)
* [X] Patrons Listing page (*all_patrons.html*)
* [X] Loans Listing page (*all_loans.html*) so I can view this information. See navigation on all pages for examples.

##Books Listing Page: 

As a librarian, I should be able to filter books by ‘overdue’ and ‘checked out’ status on the Books Listing Page so I can quickly see the state of the library. Examples: all_books.html, overdue_books.html and checked_books.html.

##Add a New Book: [X]

As a librarian, I should be able to add a book to the database so that they can be tracked on the system. Example: new_book.html.

* The required fields for user input are:
  * [x] title
  * [x] author
  * [x] genre
* Optional fields:
  * [x]first_published

The form should check that the information is valid. If the form information is valid, the page should redirect to the Books Listing Page, and the new book should appear in the list with updated information.

##Book Detail Page: 

As a librarian, I should be able to go to a book’s detail page, make edits and view its loan history. Example book_detail.html.
There should be links to:
* [x] return checked out or overdue books
* [x] each patron in the loan history

##Loan Listing Page: 

As a librarian, I should be able to filter loans by “All”, “Overdue”, and “Checked Out”, so I can quickly see the state of the loan. Examples all_loans.html, overdue_loans.html and checked_loans.html.

**There should be links to:**

* [x] return checked out or overdue books.
* [x] each book in the loan history.
* [x] each patron in the loan history.

##New Loan Page:

As a librarian, I should be able to check out a book so I can lend books to patrons. Example new_loan.html.


* [x] The book field should be a **select box** where you can select the book_id
* [x] The patron field should be a **select box** where you can select the patron_id
* [x] The loaned_on field should be auto populated with today’s date. Example: 2016-10-20
* [x] The returned by date should also be pre-populated with a date 7 days in the future, for example: 2016-10-27

* The required fields for the New Loan field are:
  * [x] book_id
  * [x] patron_id
  * [x] loaned_on
  * [x] return_by
* Optional:
  * [x] returned_on

##Return Book Page: 

As a librarian, I should be able to return a book so we know the current state of a book in our library. Example:return_book.html.

The only field should be for the returned_on should be **pre-populated with today’s date**. Example: 2016-10-20.

* [x] returned_on is a required field.

##Patron Listing Page: 

As a librarian, I should be able to:
* [x] List all patrons so I can find and access library-goers easily. Example: all_patrons.html.

* [x] There should be **links to each patron detail page.**

##Patron Detail Page: 

As a librarian, I should be able to go to a **patron's detail page**, make edits and view their loan history. Example patron_detail.html.

* There should be links to:
  * [x] return checked out or overdue books.
  * [x] each book in the loan history.

##New Patron Page: 

As a librarian, I should be able to create new library patrons so they can use the facilities. Example: new_patron.html.

* The required fields for user input are:
  *  [x] first_name
  *  [x] last_name
  *  [x] address
  *  [x] email
  *  [x] library_id
  *  [x] zip_code

##Notifications

As a librarian, I should be able to be notified if any of the required fields in any given form have any missing data, so that I can correct the information.
For example, if the first name field is empty on the new patron form and the librarian submits it, the librarian should see: “First Name is required”.

##Extra Credit

**To get an "exceeds" rating, you can expand on the project in the following ways:**

*  [X] Include pagination for the loans and books listing pages.
*  [X] Include search fields on at least one of the books or patrons listing pages.
*Examples:*
*  [x] first_name, last_name,library_id, etc for patrons
*  [x] title, author, genre, etc for books

Searching should be case **insensitive** and be partial matches for strings.

***NOTE:***

* To get an "Exceeds Expectations" grade for this project, you'll need to complete each of the items in this section. See the rubric in the "How You'll Be Graded" tab above for details on how you'll be graded.
* If you’re shooting for the "Exceeds Expectations" grade, it is recommended that you mention so in your submission notes.
* Passing grades are final. If you try for the "Exceeds Expectations" grade, but miss an item and receive a “Meets Expectations” grade, you won’t get a second chance. Exceptions can be made for items that have been misgraded in review.
