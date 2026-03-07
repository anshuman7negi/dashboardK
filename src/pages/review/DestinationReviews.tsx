import { useEffect, useState } from "react";
import { fetchReviews, type ReviewResponse } from "../../services/reviewApi";
import { CreateReviewModal } from "./CreateReviewModal";
import { Star, Trash2, Pencil } from "lucide-react";
import { deleteReviewByAdmin, updateReview } from "../../services/reviewApi";
import toast from "react-hot-toast";

interface Props {
  destinationId: number;
}

export const DestinationReviews = ({ destinationId }: Props) => {

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editingReview, setEditingReview] =
    useState<ReviewResponse | null>(null);

  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  const size = 4;

  /* ================= FETCH REVIEWS ================= */

  const loadReviews = async () => {

    try {

      setLoading(true);

      const res = await fetchReviews(destinationId, page, size);

      setReviews(prev =>
        page === 0 ? res.content : [...prev, ...res.content]
      );

      if (res.content.length < size) setHasMore(false);

    } catch {

      toast.error("Failed to load reviews");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadReviews();
  }, [page, destinationId]);

  /* ================= DELETE ================= */

  const confirmDelete = async () => {

    if (!deleteId) return;

    try {

      await deleteReviewByAdmin(deleteId);

      setReviews(prev => prev.filter(r => r.id !== deleteId));

      toast.success("Review deleted");

      setDeleteId(null);

    } catch {

      toast.error("Delete failed");

    }

  };

  /* ================= EDIT ================= */

  const openEdit = (review: ReviewResponse) => {

    setEditingReview(review);

    setEditComment(review.comment);

    setEditRating(review.rating);

  };

  const submitEdit = async () => {

    if (!editingReview) return;

    try {

      await updateReview(destinationId, editingReview.id, {
        rating: editRating,
        comment: editComment
      });

      setReviews(prev =>
        prev.map(r =>
          r.id === editingReview.id
            ? { ...r, rating: editRating, comment: editComment }
            : r
        )
      );

      toast.success("Review updated");

      setEditingReview(null);

    } catch {

      toast.error("Update failed");

    }

  };

  /* ================= AVG RATING ================= */

  const avgRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  /* ================= DATE ================= */

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="mt-16 pt-12 border-t">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-10">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Visitor Reviews
          </h2>
          <p className="text-sm text-gray-500">
            Real experiences shared by travelers
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl shadow-sm">

            <Star className="text-orange-500 fill-orange-500" size={20} />

            <div>
              <span className="font-semibold text-gray-900">
                {avgRating.toFixed(1)}
              </span>

              <span className="text-xs text-gray-500 ml-2">
                ({reviews.length})
              </span>
            </div>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-white font-medium
            bg-gradient-to-r from-orange-500 to-green-500 shadow"
          >
            Write Review
          </button>

        </div>

      </div>

      {/* REVIEW GRID */}

      {reviews.length > 0 && (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {reviews.map(review => (

            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-5
  shadow-sm hover:shadow-md transition max-w-md"
            >

              <div className="flex items-center gap-3 mb-4">

                <img
                  src={`https://ui-avatars.com/api/?name=User+${review.userId}&background=random`}
                  className="w-10 h-10 rounded-full"
                />

                <div>

                  <p className="font-semibold text-sm">
                    User {review.userId}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>

                </div>

                <div className="ml-auto flex items-center gap-3">

                  {/* STARS */}

                  <div className="flex">

                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? "text-orange-500 fill-orange-500"
                            : "text-gray-300"
                        }
                      />
                    ))}

                  </div>

                  {/* EDIT */}

                  <button
                    onClick={() => openEdit(review)}
                    className="w-8 h-8 flex items-center justify-center
                    rounded-full bg-blue-50 text-blue-600
                    hover:bg-blue-600 hover:text-white transition"
                  >
                    <Pencil size={14} />
                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() => setDeleteId(review.id)}
                    className="w-8 h-8 flex items-center justify-center
                    rounded-full bg-red-50 text-red-600
                    hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>

              </div>

              <p className="text-gray-600 text-sm">
                {review.comment}
              </p>

            </div>

          ))}

        </div>

      )}

      {/* LOAD MORE */}

      {hasMore && reviews.length > 0 && (

        <div className="mt-10 text-center">

          <button
            onClick={() => setPage(prev => prev + 1)}
            className="px-6 py-2 rounded-xl text-white
            bg-gradient-to-r from-orange-500 to-green-500"
          >
            {loading ? "Loading..." : "Load More"}
          </button>

        </div>

      )}

      {/* CREATE MODAL */}

      {showModal && (

        <CreateReviewModal
          destinationId={destinationId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setPage(0);
            setReviews([]);
            setHasMore(true);
          }}
        />

      )}

      {/* DELETE MODAL */}

      {deleteId && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm
        flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl shadow-xl w-80">

            <h3 className="font-semibold mb-4">
              Delete this review?
            </h3>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

      {/* EDIT MODAL */}

      {editingReview && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm
        flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">

            <h3 className="font-semibold mb-4">
              Edit Review
            </h3>

            <textarea
              value={editComment}
              onChange={e => setEditComment(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            />

            <input
              type="number"
              min={1}
              max={5}
              value={editRating}
              onChange={e => setEditRating(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mb-4"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};