import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteComment, updateComment, upvoteComment, downvoteComment } from '../utils/api';

const Comment = ({ comment, postId, onVote }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleVote = async (type) => {
    if (!user) return;
    
    try {
      if (type === 'upvote') {
        await upvoteComment(comment._id);
      } else {
        await downvoteComment(comment._id);
      }
      onVote(comment._id);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateComment(comment._id, { content: editedContent });
      setIsEditing(false);
      onVote(comment._id);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await deleteComment(comment._id);
      onVote(comment._id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const voteCount = comment.upvotes.length - comment.downvotes.length;
  const isAuthor = user && comment.author._id === user.id;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleVote('upvote')}
            className={`text-gray-500 hover:text-green-500 ${
              user && comment.upvotes.includes(user.id) ? 'text-green-500' : ''
            }`}
          >
            ▲
          </button>
          <span className="font-semibold">{voteCount}</span>
          <button
            onClick={() => handleVote('downvote')}
            className={`text-gray-500 hover:text-red-500 ${
              user && comment.downvotes.includes(user.id) ? 'text-red-500' : ''
            }`}
          >
            ▼
          </button>
        </div>
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={handleEdit} className="space-y-2 raleFont">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-gray-800 raleFont">{comment.content}</p>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                <span>By <span className="roboFont text-xl">{comment.author.username}</span> {new Date(comment.createdAt).toLocaleDateString()}</span>
                {isAuthor && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="raleFont text-indigo-500 hover:text-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="raleFont text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
