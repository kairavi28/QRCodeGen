const API_BASE = "/api/products";

export async function createProduct(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to create product" }));
    throw new Error(error.message || "Failed to create product");
  }
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Product not found" }));
    throw new Error(error.message || "Product not found");
  }
  return res.json();
}

export async function searchProductsByName(name) {
  const res = await fetch(`${API_BASE}/search?name=${encodeURIComponent(name)}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Search failed" }));
    throw new Error(error.message || "Search failed");
  }
  return res.json();
}

export async function addServiceRecord(id, service) {
  const res = await fetch(`${API_BASE}/${id}/service`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to add service record" }));
    throw new Error(error.message || "Failed to add service record");
  }
  return res.json();
}
