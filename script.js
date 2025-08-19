
// script.js -- simple cart logic and Excel export
(function(){
  // Load cart from localStorage
  function loadCart(){
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }
  function saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  function addToCart(item){
    const cart = loadCart();
    const existing = cart.find(p => p.code === item.code);
    if(existing){
        existing.qty += item.qty;
    }else{
        cart.push(item);
    }
    saveCart(cart);
    alert('เพิ่ม '+item.name+' ไปยังตะกร้าแล้ว');
  }

  // Attach to product buttons
  document.querySelectorAll('button[data-code]').forEach(btn=>{
     btn.addEventListener('click',function(){
        const code = this.dataset.code;
        const name = this.dataset.name;
        const price = parseFloat(this.dataset.price);
        addToCart({code,name,price,qty:1});
     });
  });

  // If on basket page, render table
  if(document.getElementById('cart-table-body')){
     const tbody = document.getElementById('cart-table-body');
     const cart = loadCart();
     let total = 0;
     cart.forEach(item=>{
        const tr = document.createElement('tr');
        tr.className = 'bg-white';
        tr.innerHTML = `
           <td class="p-3 border">${item.code}</td>
           <td class="p-3 border">${item.name}</td>
           <td class="p-3 border">${item.qty}</td>
           <td class="p-3 border">฿${item.price}</td>
           <td class="p-3 border">฿${item.price*item.qty}</td>
        `;
        tbody.appendChild(tr);
        total += item.price*item.qty;
     });
     // total row
     const totalRow = document.createElement('tr');
     totalRow.innerHTML = `
        <td colspan="4" class="p-3 text-right">รวมทั้งสิ้น</td>
        <td class="p-3">฿${total}</td>
     `;
     tbody.appendChild(totalRow);

     // Excel export
     const exportBtn = document.getElementById('export-excel');
     if(exportBtn){
        exportBtn.addEventListener('click',function(){
          if(typeof XLSX === 'undefined'){ alert('SheetJS not loaded'); return; }
          const ws_data = [['รหัส','ชื่อ','จำนวน','ราคาต่อหน่วย','รวม']];
          cart.forEach(it=> ws_data.push([it.code,it.name,it.qty,it.price,it.price*it.qty]));
          ws_data.push(['','','','','']);
          ws_data.push(['รวม', '', '', '', total]);
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(ws_data);
          XLSX.utils.book_append_sheet(wb, ws, 'Cart');
          XLSX.writeFile(wb, 'cart.xlsx');
        });
     }

     // Send to Apps Script if deploy url is set
     const GAS_URL = window.GAS_URL || '';
     if(GAS_URL){
        fetch(GAS_URL,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(cart)
        }).then(r=> console.log('Sent to Google Apps Script')).catch(console.error);
     }
  }
})();
