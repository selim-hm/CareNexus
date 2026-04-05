import axiosInstance from "../../../utils/axiosInstance";

// Fetch predefined categories for posts
const getCategories = async () => {
    const response = await axiosInstance.get('/categories/all?type=blog');
    return response.data;
};

// Create a new post
const createPost = async (postData) => {
    const response = await axiosInstance.post('/posts/add', postData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

// Get Doctor's own posts
const getDoctorPosts = async (userId) => {
    const response = await axiosInstance.get(`/posts/${userId}`);
    return response.data;
};

// Get Global Feed
const getGlobalFeed = async (page = 1) => {
    const response = await axiosInstance.get(`/posts?namPage=${page}`);
    return response.data;
};

// Like a post
const likePost = async (postId) => {
    const response = await axiosInstance.put(`/posts/${postId}/like`, {});
    return response.data;
};

// Get one post by ID
const getPostById = async (postId) => {
    const response = await axiosInstance.get(`/posts/post/${postId}`);
    return response.data;
};

// Get comments for a post
const getComments = async (postId) => {
    const response = await axiosInstance.get(`/comment/${postId}/comments`);
    return response.data;
};

// Add a comment or reply
const addComment = async (postId, commentData) => {
    const response = await axiosInstance.post(`/comment/${postId}`, commentData);
    return response.data;
};

// Unlike a post
const unlikePost = async (postId) => {
    const response = await axiosInstance.put(`/posts/${postId}/unlike`, {});
    return response.data;
};


const postService = {
    getCategories,
    createPost,
    getDoctorPosts,
    getGlobalFeed,
    likePost,
    unlikePost,
    getPostById,
    getComments,
    addComment,
};

export default postService;
