import { configureStore } from '@reduxjs/toolkit'
import aiAppReducer from './slices/aiAppSlice'
import aiChatReducer from './slices/aiChatSlice'
import aiImageReducer from './slices/aiImageSlice'
import authReducer from '../pages/Auth/stores/authSlice'
import doctorReducer from '../pages/Doctor/stores/doctorSlice'
import postReducer from '../pages/Doctor/stores/postSlice'
import knowledgeReducer from '../pages/public/stores/knowledgeSlice'
import sliderReducer from './slices/sliderSlice'

export const store = configureStore({
  reducer: {
    aiApp: aiAppReducer,
    aiChat: aiChatReducer,
    aiImage: aiImageReducer,
    auth: authReducer,
    doctor: doctorReducer,
    post: postReducer,
    knowledge: knowledgeReducer,
    slider: sliderReducer,
  },
})
