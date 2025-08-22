const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});


router
.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn, upload.array('listing[images]', 5),validateListing, wrapAsync(ListingController.createListing));  

// Step 1: Category selection before creating listing
router.get("/select-category", isLoggedIn, ListingController.renderSelectCategory);


//new Route to create a new listing
router.get("/new",isLoggedIn, ListingController.renderNewListingForm);


//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(ListingController.renderEditListingForm));

router
.route("/:id")
.get( wrapAsync(ListingController.showListing))
.put(isLoggedIn,isOwner,upload.array('listing[images]',5),validateListing, wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(ListingController.destroyListing));

module.exports = router;


