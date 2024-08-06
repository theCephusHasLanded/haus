import axiosInstance from '../utils/axios';
import { EMAIL_CONFIG } from '../config/emailConfig';

export const sendFeedback = async (feedbackData) => {
  try {
    const response = await axiosInstance.post('/api/feedback', {
      ...feedbackData,
      to: EMAIL_CONFIG.recipientEmail,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw error;
  }
};
