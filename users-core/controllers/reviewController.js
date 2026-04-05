const updateProductRating = require("../../middlewares/updateProductRating");
const { getUserReview } = require("../../models/users-core/Review.models");
const Review = getUserReview();

exports.addComment = async (req, res) => {
  try {
    const { productId, comment, rating } = req.body;
    const userId = req.user.id;

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "you rell to send a review for this product" });
    }

    const newReview = new Review({
      user: userId,
      product: productId,
      rating: rating,
      comment: comment,
    });
    await newReview.save();

    await updateProductRating(productId);

    res.status(200).json({ message: "Comment added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const userId = req.user.id;
    const reviewId = req.params.id;

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, user: userId },
      { comment },
      { new: true },
    );

    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or unauthorized" });
    }

    await updateProductRating(review.product);

    res.status(200).json({ message: "Comment updated", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId,
    });

    if (!review) return res.status(404).json({ message: "Review not found" });

    await updateProductRating(review.product);

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorReviews = async (req, res) => {
    try {
        const doctorId = req.user._id || req.user.id;
        const { getOrderModel } = require("../../models/users-core/order.models");
        const Order = getOrderModel();

        // 1. Find all orders where this doctor is the provider
        const orders = await Order.find({ provider: doctorId }).select('_id');
        const orderIds = orders.map(o => o._id);

        // 2. Find all reviews for these orders
        const reviews = await Review.find({ product: { $in: orderIds } })
            .populate('user', 'username avatar email')
            .populate('product', 'medicalServiceType title appointmentDate')
            .sort({ createdAt: -1 });

        // 3. Calculate metrics
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            reviews,
            stats: {
                totalReviews,
                averageRating: Number(averageRating)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
