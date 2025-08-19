// SweetAlert2 wrapper
function showAlert(message, type = 'info') {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: type,
      text: message,
      confirmButtonColor: '#d33',
    });
  } else {
    alert(message);
  }
}

// Example modification for adding product
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  showAlert("เพิ่มสินค้าลงตะกร้าแล้ว!", "success");
}

// Save cart to Google Apps Script
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveCartBtn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", async () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      showAlert("ตะกร้าว่างเปล่า", "warning");
      return;
    }

    Swal.fire({
      title: "กำลังบันทึก...",
      text: "กรุณารอสักครู่",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const totalItems = cart.length;
    const params = new URLSearchParams();
    params.append("name", "ลูกค้า");
    params.append("phone", "0123456789");
    params.append("cart", JSON.stringify(cart));
    params.append("totalItems", totalItems);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyw8gH8Qgb6MdQ-nZf4xNo1ny357j2WlBNq7urD4QAJqPcwFNrh-gZNhwgvLSiGyqCUSg/exec", {
        method: "POST",
        body: params
      });

      const result = await response.json();
      if (result.status === "success") {
        Swal.fire("สำเร็จ", "บันทึกตะกร้าเรียบร้อยแล้ว", "success");
      } else {
        Swal.fire("ผิดพลาด", result.message || "ไม่สามารถบันทึกได้", "error");
      }
    } catch (err) {
      Swal.fire("ผิดพลาด", err.message, "error");
    }
  });
});
