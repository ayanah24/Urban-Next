const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const cloudinary = require('cloudinary').v2;

// Show all listings (with category filter)
module.exports.index = async (req, res) => {
  const { category, q } = req.query;
  const filter = {};
  if (category && category.trim()) filter.category = category.trim();
  if (q && q.trim()) filter.location = { $regex: q.trim(), $options: "i" };
  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings, selectedCategory: category, q ,hideSearch:false});
};

// Show category selection page before creating listing
module.exports.renderSelectCategory = (req, res) => {
    res.render("listings/selectCategory.ejs", { hideSearch: true });
};

// New listing form with pre-selected category
module.exports.renderNewListingForm = (req, res) => {
    const category = req.query.category || "";
    res.render("listings/new.ejs", { hideSearch: true, category });
};

// Show a single listing
module.exports.showListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist.");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

// Create a new listing
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    // Handle multiple images
    newListing.image = [];  // Initialize as empty array
    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            newListing.image.push({ url: file.path, filename: file.filename });
        });
    }

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

// Render edit form for an existing listing
module.exports.renderEditListingForm = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist.");
        return res.redirect("/listings");
    }

    // Safely generate preview URLs for all images (resized for thumbnails)
    let previewImageUrls = [];
    if (listing.image && listing.image.length > 0) {
        previewImageUrls = listing.image.map(img => 
            img.url ? img.url.replace("/upload", "/upload/w_250,h_300,c_fill") : null
        ).filter(url => url !== null);  // Filter out any invalid
    }

    res.render("listings/edit.ejs", { listing, previewImageUrls });
};

// Update an existing listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    Object.assign(listing, req.body.listing);

    if (req.body.deleteImages && req.body.deleteImages.length) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
            listing.image = listing.image.filter(img => img.filename !== filename);
        }
    }

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            listing.image.push({ url: file.path, filename: file.filename });
        });
    }

    await listing.save();
    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${id}`);
};


// Delete listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully Deleted a listing!");
    res.redirect("/listings");
};
