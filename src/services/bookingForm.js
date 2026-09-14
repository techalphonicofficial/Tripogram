import { API_KEY, API_URL, api } from "./config";

// Fetch booking details by ID
export async function getBookingDetail(id) {
  try {
    // console.log('Fetching booking details for ID:', id);
    const res = await api.get("/booking/get-booking", {
      params: { id: id },
    });
    // console.log('Booking details response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch booking details"
    );
  }
}


export async function applyCoupon(couponCode) {
  try {
    const res = await api.post("/post-coupen", {
      coupon_code: couponCode,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to apply coupon"
    );
  }
}

export async function submitBookingDetail(formData) {
  try {

    const formDataEntries = [];
    for (let pair of formData.entries()) {
      if (pair[0].includes('proof') && pair[1] instanceof File) {
        formDataEntries.push({
          field: pair[0],
          type: 'File',
          name: pair[1].name,
          size: pair[1].size,
          mimeType: pair[1].type
        });
      } else {
        formDataEntries.push({
          field: pair[0],
          value: pair[1].substring ? pair[1].substring(0, 200) : pair[1]
        });
      }
    }

    const endpoint = `${API_URL}/booking/booking-information`;


    const res = await fetch(endpoint, {
      headers: {
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      },
      method: "POST",
      body: formData,

    });



    const responseText = await res.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      // console.log('Response is not JSON');
      responseData = { message: responseText };
    }

    if (!res.ok) {
      throw new Error(responseData.message || `HTTP error! Status: ${res.status}`);
    }

    return responseData;

  } catch (error) {
    console.error("Booking submission error:", error);
    throw error;
  }
}
