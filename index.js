document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); //chặn sự kiện reset trang
  let name = document.querySelector("#name").value;
  //tạo ra 1 đối tượng có giá trị là name
  //và phải có id: new Date()
  let item = {
    id: new Date().toISOString(),
    name: name.trim(),
  };
  //thêm item vào giao diện
  addItemToUI(item);
  //xóa input trên thanh add
  document.querySelector("#name").value = "";
  //lưu lại item vào localStorage
  addItemToLS(item);
});

//getList(): hàm lấy ra danh sách các item đã lưu trong localStorage
const getList = () => {
  return JSON.parse(localStorage.getItem("list")) || [];
};

//hàm nhận vào 1 item, và render nó lên màn hình
const addItemToUI = (item) => {
  let newCard = document.createElement("div");
  newCard.className =
    "d-flex card flex-row justify-content-between align-items-center mb-3 p-2";
  newCard.innerHTML = `<span>${item.name}</span>
    <button type="button" class="btn btn-danger btn-sm btn-remove" data-id="${item.id}">Remove</button>`;
  document.querySelector(".list").appendChild(newCard);
};
//hàm nhận item và lưu vào localStorage
const addItemToLS = (item) => {
  let list = getList();
  list.push(item); //thêm vào danh sách
  //lưu lại danh sách lên localStorage
  localStorage.setItem("list", JSON.stringify(list));
};

//hàm render tất cả các item có trong list lên UI mỗi lần load trang
const init = () => {
  let list = getList();
  list.forEach((item) => {
    addItemToUI(item);
  });
};
init();

// sự kiện xóa 1 item
document.querySelector(".list").addEventListener("click", (event) => {
  // nếu chỗ bị click là 1 element có btn-remove thì mới làm
  if (event.target.classList.contains("btn-remove")) {
    let nameItem = event.target.previousElementSibling.innerHTML;
    let isConfirmed = confirm(`Bạn có chắc là muốn xóa item: ${nameItem}`);
    if (isConfirmed) {
      // xóa item trên UI
      let card = event.target.parentElement;
      card.remove();
      // xóa item trên LS
      let idRemove = event.target.dataset.id;
      removeItemFromLS(idRemove);
    }
  }
});

// hàm nhận vào id cần xóa và xóa item có id tương ứng trong localStorage
const removeItemFromLS = (idRemove) => {
  let list = getList();
  list = list.filter((item) => item.id != idRemove);
  localStorage.setItem("list", JSON.stringify(list));
};

// sự kiện click vào removeall
document.querySelector("#btn-remove-all").addEventListener("click", (event) => {
  const isConfirmed = confirm(`Có chắc là muốn xóa hết khum bé ơi?`);
  if (isConfirmed) {
    document.querySelector(".list").innerHTML = ""; //cập nhật ui
    localStorage.removeItem("list");
  }
});

// sự kiện filter
document.querySelector("#filter").addEventListener("keyup", (event) => {
  const valueInput = event.target.value;
  let list = getList();
  let filterList = list.filter((item) => item.name.includes(valueInput));
  document.querySelector(".list").innerHTML = ""; //xóa trước khi hiện thi danh sách đã lọc
  filterList.forEach((item) => {
    addItemToUI(item);
  });
});
