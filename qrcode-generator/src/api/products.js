const API_BASE = "https://api.biomedwaste.net/api/products";

export async function createProduct(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  return res.json();
}

export async function addServiceRecord(id, service) {
  const res = await fetch(`${API_BASE}/${id}/service`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  return res.json();
}
