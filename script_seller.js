const API_URL = "https://zingmini-backend-2.onrender.com";

// 🟢 Lấy thông tin user hiện tại (đã đăng nhập trong ZingMini)
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

if (!currentUser._id) {
  alert("⚠️ Bạn cần đăng nhập ZingMini trước khi đăng bán sản phẩm!");
}

// 🟢 Load sản phẩm
async function loadSellerProducts() {
  try {
    const res = await fetch(
      `${API_URL}/api/products/seller/${currentUser._id}`,
    );
    const data = await res.json();
    const list = document.getElementById("sellerProducts");
    list.innerHTML = "";

    data.forEach((p) => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${p.image || "https://via.placeholder.com/200"}">
        <h3>${p.name}</h3>
        <p>${Number(p.price).toLocaleString()}đ</p>
        <button onclick="deleteProduct('${p._id}')">🗑️ Xóa</button>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Lỗi load sản phẩm:", err);
  }
}

// 🟢 Xử lý khi submit form đăng sản phẩm
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const body = {
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    price: Number(form.price.value),
    stock: Number(form.stock.value),
    category: form.category.value.trim(),
    image: form.image.value.trim(),
    seller: currentUser._id, // ✅ người thật việc thật
  };

  console.log("📦 Gửi sản phẩm:", body);

  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert("✅ Đã đăng sản phẩm thành công!");
    form.reset();
    loadSellerProducts();
  } else {
    const err = await res.json().catch(() => ({}));
    alert("❌ Lỗi khi đăng sản phẩm: " + (err.message || res.statusText));
    console.error("Chi tiết:", err);
  }
});

// 🟢 Xóa sản phẩm
async function deleteProduct(id) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    alert("✅ Đã xóa sản phẩm!");
    loadSellerProducts();
  } else {
    alert("❌ Lỗi khi xóa sản phẩm!");
  }
}

loadSellerProducts();
