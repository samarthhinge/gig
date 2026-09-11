// KaamSetu API Service - Connects frontend to Python backend (FastAPI / Flask)

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || err.message || "API request failed");
    }
    return await res.json();
  } catch (error) {
    console.warn(`[KaamSetu API] Request failed for ${path}:`, error.message);
    throw error;
  }
}

export const api = {
  // Authentication
  async login({ phone, role, federationRole }) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        phone,
        role: role ? role.toUpperCase() : "CUSTOMER",
        federation_role: federationRole ? federationRole.toUpperCase() : null,
      }),
    });
  },

  // Services
  async getServices() {
    return request("/services");
  },
  async getCategories() {
    return request("/services/categories");
  },
  async addService({ name, category, charge }) {
    return request("/services", {
      method: "POST",
      body: JSON.stringify({
        name,
        category_name: category,
        base_charge: Number(charge) || 0,
      }),
    });
  },
  async updateService(id, patch) {
    return request(`/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: patch.name,
        category_name: patch.category,
        base_charge: patch.charge ? Number(patch.charge) : undefined,
        status: patch.status,
      }),
    });
  },
  async removeService(id) {
    return request(`/services/${id}`, { method: "DELETE" });
  },

  // Workers
  async getWorkers() {
    return request("/workers");
  },
  async addWorker({ name, phone, address, photo, skills }) {
    return request("/workers", {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
        address,
        photo_url: photo || null,
        skills: skills || [],
      }),
    });
  },
  async updateWorker(id, patch) {
    return request(`/workers/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: patch.name,
        phone: patch.phone,
        address: patch.address,
        photo_url: patch.photo,
        skills: patch.skills,
        history_notes: patch.history,
      }),
    });
  },
  async setWorkerStatus(id, status) {
    return request(`/workers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: status.toUpperCase() }),
    });
  },
  async resignWorker(id) {
    return request(`/workers/${id}/resign`, { method: "POST" });
  },
  async startTravel(workerId, bookingId) {
    return request(`/workers/${workerId}/travel/start`, {
      method: "POST",
      body: JSON.stringify({ booking_id: bookingId || null }),
    });
  },
  async stopTravel(workerId, logId, distanceKm, cost) {
    return request(`/workers/${workerId}/travel/stop`, {
      method: "POST",
      body: JSON.stringify({ log_id: logId, distance_km: distanceKm, travel_cost: cost }),
    });
  },

  // Customers
  async getCustomers() {
    return request("/customers");
  },
  async addCustomer(customerData) {
    return request("/customers", {
      method: "POST",
      body: JSON.stringify({
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        photo_url: customerData.photo || null,
        email: customerData.email || null,
      }),
    });
  },
  async updateCustomer(customerId, patch) {
    return request(`/customers/${customerId}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: patch.name,
        phone: patch.phone,
        address: patch.address,
        photo_url: patch.photo,
      }),
    });
  },
  async topUpWallet(customerId, amount) {
    return request(`/customers/${customerId}/wallet/topup`, {
      method: "POST",
      body: JSON.stringify({ amount: Number(amount) }),
    });
  },

  // Bookings / Requests
  async getBookings() {
    return request("/bookings");
  },
  async createBooking({ customerId, serviceId, selectedServiceIds, workerId, serviceAddress, servicePhone, scheduledDate, scheduledTime }) {
    return request("/bookings", {
      method: "POST",
      body: JSON.stringify({
        customer_id: customerId,
        service_id: serviceId,
        selected_service_ids: selectedServiceIds || [serviceId],
        assigned_worker_id: workerId || null,
        service_address: serviceAddress,
        service_phone: servicePhone,
        scheduled_date: scheduledDate || null,
        scheduled_time: scheduledTime || null,
      }),
    });
  },
  async payBooking(bookingId) {
    return request(`/bookings/${bookingId}/pay`, { method: "POST" });
  },
  async acceptBooking(bookingId, workerId) {
    return request(`/bookings/${bookingId}/accept?worker_id=${workerId}`, { method: "POST" });
  },
  async rejectBooking(bookingId, workerId, reason) {
    return request(`/bookings/${bookingId}/reject?worker_id=${workerId}`, {
      method: "POST",
      body: JSON.stringify({ rejection_reason: reason }),
    });
  },
  async updateProgress(bookingId, { before, beforeDesc, after, afterDesc, markCompleted }) {
    return request(`/bookings/${bookingId}/progress`, {
      method: "POST",
      body: JSON.stringify({
        before_photo_url: before || null,
        before_description: beforeDesc || null,
        after_photo_url: after || null,
        after_description: afterDesc || null,
        mark_completed: !!markCompleted,
      }),
    });
  },
  async completeBooking(bookingId) {
    return request(`/bookings/${bookingId}/complete`, { method: "POST" });
  },
  async cancelBooking(bookingId, bankDetails = {}) {
    return request(`/bookings/${bookingId}/cancel`, {
      method: "POST",
      body: JSON.stringify({
        bank_account_holder: bankDetails.accHolder || null,
        bank_account_number: bankDetails.accNumber || null,
        ifsc_code: bankDetails.ifsc || null,
      }),
    });
  },

  // Complaints & Reviews
  async getComplaints() {
    return request("/complaints");
  },
  async raiseComplaint({ type, bookingId, issue, description, plaintiffUserId }) {
    return request(`/complaints?plaintiff_user_id=${plaintiffUserId || 1}`, {
      method: "POST",
      body: JSON.stringify({
        complaint_type: type,
        booking_id: bookingId || null,
        issue,
        description: description || null,
      }),
    });
  },
  async respondComplaint(complaintId, responseText) {
    return request(`/complaints/${complaintId}/respond`, {
      method: "POST",
      body: JSON.stringify({ response: responseText, status: "RESOLVED" }),
    });
  },
  async submitReview(bookingId, rating, reviewText) {
    return request("/complaints/reviews", {
      method: "POST",
      body: JSON.stringify({
        booking_id: bookingId,
        rating: Number(rating),
        review_text: reviewText || null,
      }),
    });
  },

  // Federation
  async getDashboardStats() {
    return request("/federation/dashboard");
  },
  async getMembers() {
    return request("/federation/members");
  },
  async addMember({ name, phone, address, photo, subRole }) {
    return request("/federation/members", {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
        address,
        photo_url: photo || null,
        sub_role: subRole || "MEMBER",
      }),
    });
  },
  async updateMember(id, patch) {
    return request(`/federation/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: patch.name,
        phone: patch.phone,
        address: patch.address,
        photo_url: patch.photo,
      }),
    });
  },
  async resignMember(id) {
    return request(`/federation/members/${id}/resign`, { method: "POST" });
  },
};
