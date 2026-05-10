import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, userId, rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const review = new Review({
      product: productId,
      user: userId,
      userName: user.name || user.email.split('@')[0],
      rating,
      title,
      comment,
    });

    const savedReview = await review.save();

    product.reviews.push(savedReview._id);
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    product.rating = Math.round(avgRating * 10) / 10;
    await product.save();

    res.status(201).json({ success: true, review: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await Product.findByIdAndUpdate(review.product, {
      $pull: { reviews: reviewId }
    });

    const product = await Product.findById(review.product);
    if (product) {
      const allReviews = await Review.find({ product: review.product });
      if (allReviews.length > 0) {
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        product.rating = Math.round(avgRating * 10) / 10;
      } else {
        product.rating = 0;
      }
      await product.save();
    }

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
