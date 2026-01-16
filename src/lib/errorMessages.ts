export const ERROR_MESSAGES = {
  NETWORK_ERROR: {
    title: 'Connection problem',
    description: 'Please check your internet connection and try again.'
  },
  API_ERROR: {
    title: 'Service temporarily unavailable',
    description: 'Our flight search service is experiencing issues. Please try again in a moment.'
  },
  INVALID_SEARCH: {
    title: 'Invalid search',
    description: 'Please check your search criteria and try again.'
  },
  NO_RESULTS: {
    title: 'No flights found',
    description: 'Try adjusting your dates or destinations.'
  },
  BOOKING_FAILED: {
    title: 'Booking failed',
    description: 'We couldn\'t complete your booking. Please try again.'
  }
};

export function getErrorMessage(error: any) {
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  if (error.status === 401 || error.status === 403) {
    return ERROR_MESSAGES.API_ERROR;
  }
  
  return {
    title: 'Something went wrong',
    description: error.message || 'An unexpected error occurred.'
  };
}
