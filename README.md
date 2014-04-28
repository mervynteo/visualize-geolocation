Locationify
=====================

Visualize locations saved on a map (with Google products)
------------------------------------------------------------

see http://locationify.theodoreli.com/ for a live demo

Scaffolded out with Yeoman

Tech stack:
* Front End: AngularJS(Angular Google Maps module), Sass, and Bootstrap 3
* Back End: AWS EC2(init daemon), Node.js, ExpressJS 4.0, MongoDB (Mongoose), and Mocha(should.js)

CRUD functions available via RESTful API
* Create new locations (Saves the current coordinates and user defined name)
* Read locations. Both for a single one and all
* Update locations. Can update the assigned name
* Delete locations. Click the X on the image
* All united tested

REST nouns are defined as
* /api/locations
* /api/locations/:id

Make sure to test these things to play with
* Clicking the markers on the map
* Editing location names via the pencil icon
* Deleting locations via the X icon
* All actions are reflected instantaneously in browser
* Page responsive design (still in progress though)

see http://locationify.theodoreli.com/ for a live demo
