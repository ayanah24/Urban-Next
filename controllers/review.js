const Listing = require("../models/listing");
const review=require("../models/review");

module.exports.createReview = async (req, res) => {
    console.log("📦 POST Review – req.params:", req.params);
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview= new review(req.body.review);
    newReview.author = req.user._id;  

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully created a new Review!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req, res) => {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await review.findById(reviewId);
        req.flash("success", "Successfully Deleted Review!");
        res.redirect(`/listings/${id}`);
    }