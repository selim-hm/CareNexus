import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchAvailableOrders, 
    fetchActiveOrders, 
    fetchHistoryOrders,
    fetchOrderById,
    handleOrderAction,
    updateDoctorProfile,
    changeDoctorPassword,
    fetchConversations,
    fetchDoctorReviews 
} from './doctorService';

const initialState = {
    availableOrders: [],
    activeOrders: [],
    historyOrders: [],
    currentOrder: null,
    loading: false,
    actionLoading: false,
    error: null,
    lastUpdated: null,
    currentTitle: '',
    conversations: [],
    reviews: [],
    reviewStats: null,
};

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
        setHeaderTitle: (state, action) => {
            state.currentTitle = action.payload;
        },
        clearDoctorState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Available Orders
            .addCase(fetchAvailableOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailableOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.availableOrders = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchAvailableOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Active Orders
            .addCase(fetchActiveOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.activeOrders = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchActiveOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // History Orders
            .addCase(fetchHistoryOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHistoryOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.historyOrders = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchHistoryOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle Actions
            .addCase(handleOrderAction.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(handleOrderAction.fulfilled, (state) => {
                state.actionLoading = false;
            })
            .addCase(handleOrderAction.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            // Fetch Order By ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Profile Update
            .addCase(updateDoctorProfile.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateDoctorProfile.fulfilled, (state, action) => {
                state.actionLoading = false;
                // Note: user object in authSlice is what usually needs update
                // But we can store a success flag or updated partial data if needed
            })
            .addCase(updateDoctorProfile.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            // Change Password
            .addCase(changeDoctorPassword.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(changeDoctorPassword.fulfilled, (state) => {
                state.actionLoading = false;
            })
            .addCase(changeDoctorPassword.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            // Conversations
            .addCase(fetchConversations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload.conversations;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reviews
            .addCase(fetchDoctorReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
                state.reviewStats = action.payload.stats;
            })
            .addCase(fetchDoctorReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetError, clearDoctorState, setHeaderTitle } = doctorSlice.actions;
export default doctorSlice.reducer;
