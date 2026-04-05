import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
    posts: [],
    globalPosts: [],
    categories: [],
    totalPages: 1,
    currentPage: 1,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    currentPost: null,
    comments: [],
    isCommentLoading: false
};

// Async Thunks
export const fetchCategories = createAsyncThunk('post/fetchCategories', async (_, thunkAPI) => {
    try {
        return await postService.getCategories();
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const requestCreatePost = createAsyncThunk('post/createPost', async (postData, thunkAPI) => {
    try {
        return await postService.createPost(postData);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchDoctorPosts = createAsyncThunk('post/fetchDoctorPosts', async (userId, thunkAPI) => {
    try {
        return await postService.getDoctorPosts(userId);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchGlobalFeed = createAsyncThunk('post/fetchGlobalFeed', async (page, thunkAPI) => {
    try {
        return await postService.getGlobalFeed(page);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const toggleLike = createAsyncThunk('post/toggleLike', async ({ postId, isLiked }, thunkAPI) => {
    try {
        if (isLiked) {
            return await postService.unlikePost(postId);
        } else {
            return await postService.likePost(postId);
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchPostDetails = createAsyncThunk('post/fetchPostDetails', async (postId, thunkAPI) => {
    try {
        return await postService.getPostById(postId);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchComments = createAsyncThunk('post/fetchComments', async (postId, thunkAPI) => {
    try {
        return await postService.getComments(postId);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const requestAddComment = createAsyncThunk('post/addComment', async ({ postId, commentData }, thunkAPI) => {
    try {
        return await postService.addComment(postId, commentData);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        resetPostState: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
            state.currentPost = null;
            state.comments = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Categories
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            // Create Post
            .addCase(requestCreatePost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(requestCreatePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Add new post to top of both lists
                if (action.payload.post) {
                    state.posts.unshift(action.payload.post);
                    state.globalPosts.unshift(action.payload.post);
                }
            })
            .addCase(requestCreatePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Fetch Doctor Posts
            .addCase(fetchDoctorPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDoctorPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload; // array of posts
            })
            .addCase(fetchDoctorPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Fetch Global Feed
            .addCase(fetchGlobalFeed.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchGlobalFeed.fulfilled, (state, action) => {
                state.isLoading = false;
                if(action.payload.currentPage === 1) {
                     state.globalPosts = action.payload.posts;
                } else {
                     // Append for pagination
                     state.globalPosts = [...state.globalPosts, ...action.payload.posts];
                }
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchGlobalFeed.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Toggle Like
            .addCase(toggleLike.fulfilled, (state, action) => {
                 // The payload is the updated post
                 const updatedPost = action.payload;
                 // Update in doctor posts
                 const docIndex = state.posts.findIndex(p => p.id === updatedPost.id || p._id === updatedPost._id);
                 if (docIndex !== -1) state.posts[docIndex] = updatedPost;
                 // Update in global feed
                 const globalIndex = state.globalPosts.findIndex(p => p.id === updatedPost.id || p._id === updatedPost._id);
                 if (globalIndex !== -1) state.globalPosts[globalIndex] = updatedPost;
                  
                  if (state.currentPost && (state.currentPost._id === updatedPost._id || state.currentPost.id === updatedPost.id)) {
                      state.currentPost = updatedPost;
                  }
             })
             // Fetch Post Details
             .addCase(fetchPostDetails.pending, (state) => {
                 state.isLoading = true;
             })
             .addCase(fetchPostDetails.fulfilled, (state, action) => {
                 state.isLoading = false;
                 state.currentPost = action.payload;
             })
             .addCase(fetchPostDetails.rejected, (state, action) => {
                 state.isLoading = false;
                 state.isError = true;
                 state.message = action.payload;
             })
             // Fetch Comments
             .addCase(fetchComments.pending, (state) => {
                 state.isCommentLoading = true;
             })
             .addCase(fetchComments.fulfilled, (state, action) => {
                 state.isCommentLoading = false;
                 state.comments = action.payload;
             })
             // Add Comment
             .addCase(requestAddComment.fulfilled, (state, action) => {
                 const newComment = action.payload;
                 // If it's a top-level comment, unshift to state.comments
                 if (!newComment.parentComment) {
                     state.comments.unshift(newComment);
                 } else {
                     // Find parent and add to replies (recursive search would be better if deeply nested, 
                     // but likely backend builder nestedComments handles building the tree on fetch)
                     // For immediate UI update of a reply, we can either re-fetch or find parent in map
                     // Let's just re-fetch for simplicity or find parent if it's top-level
                     const parent = state.comments.find(c => c._id === newComment.parentComment);
                     if (parent) {
                         if (!parent.replies) parent.replies = [];
                         parent.replies.push(newComment);
                     }
                 }
             });
    }
});

export const { resetPostState } = postSlice.actions;
export default postSlice.reducer;
