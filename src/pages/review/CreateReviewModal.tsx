import { useState } from "react";
import { Star, X } from "lucide-react";
import toast from "react-hot-toast";
import { createReview } from "../../services/reviewApi";


interface Props {
  destinationId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateReviewModal = ({
  destinationId,
  onClose,
  onSuccess,
}: Props) => {

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    try {

      setLoading(true);

      await createReview(destinationId, {
        rating,
        comment,
      });

      toast.success("Review submitted successfully 🎉");

      onSuccess();
      onClose();

    } catch (err: any) {

      toast.error(
        err?.response?.data?.message || "Failed to submit review"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-bold">
            Write a Review
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>

        </div>

        {/* STAR RATING */}

        <div className="flex gap-2 mb-6 justify-center">

          {[1,2,3,4,5].map((star) => (

            <Star
              key={star}
              size={32}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className={`cursor-pointer transition ${
                (hover || rating) >= star
                  ? "text-orange-500 fill-orange-500"
                  : "text-gray-300"
              }`}
            />

          ))}

        </div>

        {/* COMMENT */}

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full border rounded-xl p-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-orange-400"
          rows={4}
        />

        {/* BUTTON */}

        <button
          onClick={submitReview}
          disabled={loading}
          className="mt-6 w-full py-2 rounded-xl text-white font-medium
          bg-gradient-to-r from-orange-500 to-green-500
          hover:opacity-90 transition"
        >

          {loading ? "Submitting..." : "Submit Review"}

        </button>

      </div>

    </div>
  );
};