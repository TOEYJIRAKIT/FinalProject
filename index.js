
// การให้สิทธิ์ผู้ใช้ (authority) admin = 0 , user = 1 
// username = admin, password = admin@min สามารถดู แก้ไข เพิ่ม ลบ ตารางข้อมูลได้ 
// username = user, password = user@min สามารถดูตารางข้อมูลได้อย่างเดียว ไม่สามารถแก้ไข เพิ่ม ลบ ข้อมูลได้ 


/// ใส่ username และ password ตรงนี้ ///
let loginData = {
  username: "admin", //<-- username
  password: "admin@min", //<-- password
};
////////////////////////////////////

// ฟังก์ชันแสดงตารางโปรโมชั่น
function DisplayPromotion() {
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/getPromotions",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    data: loginData,
  })
    .done(function (PromoData) {
      console.log(PromoData);
      $("#dataTable").empty();
      PromoData.data.forEach((user) => {
        let Newstartdate = new Date(user.Start_date);
        let startDateText = Newstartdate.toString();
        let startDatenTime = startDateText.split(" ");
        let Newenddate = new Date(user.End_date);
        let endDateText = Newenddate.toString();
        let endDatenTime = endDateText.split(" ");
        let i = 1;
        console.log(user);
        const tr =
          "<tr>" +
          "</td><td>" +
          user.Code_Promotion +
          "</td><td>" +
          user.Descriptions +
          "</td><td>" +
          user.Discount +
          "</td><td>" +
          user.Total +
          "</td><td>" +
          user.Partner +
          "</td><td>" +
          startDatenTime[2] +
          " " +
          startDatenTime[1] +
          " " +
          startDatenTime[3] +
          "</td><td>" +
          endDatenTime[2] +
          " " +
          endDatenTime[1] +
          " " +
          endDatenTime[3] +
          '</td><td><button id="btn-edit" class="btn btn-secondary text-center mx-1" onclick="DisplayEditBox(' +
          user.id +
          ')"><i class="fa-regular fa-pen-to-square"></i></button>' +
          '<button id="btn-delete" class="btn btn-danger me-2 text-center" onclick="DeletePromotion(' +
          user.id +
          ')"><i class="fa-solid fa-trash-can"></button></td>' +
          "</tr>";
        i++;
        $("#PromotionTable").append(tr);
      });
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("Request failed: " + textStatus + ", " + errorThrown);
    });
}

// ฟังก์ชันแสดงกล่องสร้างข้อมูล
function DisplayCreateBox() {
  const leftHtml =
    '<div style="display: flex; flex-direction: column;">' +
    "<label>โค้ดส่วนลด</label>" +
    '<input id="Code_Promotion" class="swal2-input" placeholder="ป้อนโค้ดส่วนลด" type="" value=""><br>' +
    "</div>" +
    '<div style="display: flex; flex-direction: column;">' +
    "<label>รายละเอียด</label>" +
    '<input id="Descriptions" class="swal2-input" rows="5" placeholder="ป้อนรายละเอียด" type="" value=""><br>' +
    "</div>" +
    '<div style="display: flex; flex-direction: column;">' +
    "<label>ส่วนลด (บาท)</label>" +
    '<input id="Discount" class="swal2-input" placeholder="ป้อนส่วนลด" type="" value= "" min="1" max="1000000"><br>' +
    "</div>" +
    '<div style="display: flex; flex-direction: column;">' +
    "<label>จำนวน</label>" +
    '<input id="Total" class="swal2-input" placeholder="ป้อนจำนวน" type="" value= "" min="1" max="1000000"><br>' +
    "</div>";

  const rightHtml =
    '<div style="display: flex; flex-direction: column;">' +
    "<label>พาร์ทเนอร์</label>" +
    '<input id="Partner" class="swal2-input" placeholder="ป้อนพาร์ทเนอร์" type="" value= "" ><br>' +
    "</div>" +
    '<div style="display: flex; flex-direction: column;">' +
    "<label>ระยะเวลา (เริ่ม)</label>" +
    '<input id="Start_date" class="swal2-input" type="date" value= ""><br>' +
    "</div>" +
    '<div style="display: flex; flex-direction: column;">' +
    "<label>ระยะเวลา (สิ้นสุด)</label>" +
    '<input id="End_date" class="swal2-input" type="date" value= ""><br>' +
    "</div>";

  const html =
    '<div style="display: flex;">' +
    '<div style="flex: 1;">' +
    leftHtml +
    "</div>" +
    '<div style="flex: 1;">' +
    rightHtml +
    "</div>" +
    "</div>";

  Swal.fire({
    title: "เพิ่มโค้ดส่วนลด",
    html: html,
    focusConfirm: false,
    showCancelButton: true,
    cancelButtonText: "ยกเลิก",
    cancelButtonColor: "#fe7096",
    confirmButtonColor: "#9a55ff",
    confirmButtonText: "เพิ่ม",
    preConfirm: () => {
      CreatePromotion();
    },
  });
}

// ฟังก์ชันเพิ่มข้อมูล
function CreatePromotion() {
  const Code_Promotion = document.getElementById("Code_Promotion").value;
  const Descriptions = document.getElementById("Descriptions").value;
  const Discount = document.getElementById("Discount").value;
  const Total = document.getElementById("Total").value;
  const Partner = document.getElementById("Partner").value;
  const Start_date = document.getElementById("Start_date").value;
  const End_date = document.getElementById("End_date").value;
  const data = {
    username: loginData.username,
    password: loginData.password,
    Code_Promotion: Code_Promotion,
    Descriptions: Descriptions,
    Discount: Discount,
    Total: Total,
    Partner: Partner,
    Start_date: Start_date,
    End_date: End_date,
  };

  const url = "http://localhost:3000/insertPromotion";
  fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(JSON.stringify(data));
      if (res.msg === "inserted") {
        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลสำเร็จ",
          text: "ข้อมูลของคุณได้ถูกบันทึกเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
          showConfirmButton: true,
        }).then(() => {
          location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถเพิ่มข้อมูลได้",
          text: "เนื่องจากผู้ใช้ไม่มีสิทธิ์ในการเพิ่มข้อมูล",
          confirmButtonText: "ตกลง",
          showConfirmButton: true,
        }).then(() => {
          location.reload();
        });
      }
    });
}

// ฟังก์ชันแสดงกล่องแก้ไขข้อมูล
function DisplayEditBox(id) {
  const url = "http://localhost:3000/getPromoByID/" + id;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      let data = res.data;
      for (var i = 0; i < data.length; i++) {
        let startDate = new Date(data[i].Start_date);
        let startDateText = startDate.toString();
        let startDateTimes = startDateText.split(" ");
        let startmouth = MonthConvert(startDateTimes[1]);
        let endDate = new Date(data[i].End_date);
        let endDateText = endDate.toString();
        let endDateTimes = endDateText.split(" ");
        let endmouth = MonthConvert(endDateTimes[1]);
        Swal.fire({
          title: "แก้ไขโปรโมชั่น",
          html: `
            <div style="display: flex;">
              <div style="flex: 1;">
                <div style="display: flex; flex-direction: column;">
                  <label>โค้ดส่วนลด</label>
                  <input id="Code_Promotion" class="swal2-input" placeholder="ป้อนโค้ดส่วนลด" type="" value="${res.data[0].Code_Promotion}"><br>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <label>รายละเอียด</label>
                  <input id="Descriptions" class="swal2-input" rows="5" placeholder="ป้อนรายละเอียด" type="" value="${res.data[0].Descriptions}"><br>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <label>ส่วนลด (บาท)</label>
                  <input id="Discount" class="swal2-input" placeholder="ป้อนส่วนลด" type="" value="${res.data[0].Discount}" min="1" max="1000000"><br>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <label>จำนวน</label>
                  <input id="Total" class="swal2-input" placeholder="ป้อนจำนวน" type="" value="${res.data[0].Total}" min="1" max="1000000"><br>
              </div>
              </div>
              <div style="flex: 1;">
                <div style="display: flex; flex-direction: column;">
                  <label>พาร์ทเนอร์</label>
                  <input id="Partner" class="swal2-input" placeholder="ป้อนพาร์ทเนอร์" type="" value="${res.data[0].Partner}"><br>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <label>ระยะเวลา (เริ่ม)</label>
                  <input id="Start_date" class="swal2-input" type="date" value="${startDateTimes[3]}-${startmouth}-${startDateTimes[2]}"><br>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <label>ระยะเวลา (สิ้นสุด)</label>
                  <input id="End_date" class="swal2-input" type="date" value="${endDateTimes[3]}-${endmouth}-${endDateTimes[2]}"><br>
                </div>
              </div>
            </div>
          `,
          showCancelButton: true,
          cancelButtonColor: "#fe7096",
          cancelButtonText: "ยกเลิก",
          confirmButtonColor: "#9a55ff",
          confirmButtonText: "บันทึก",
          focusConfirm: false,
          preConfirm: () => {
            UpdatePromotion(id);
          },
        });
      }
    });
}

// ฟังก์ชันอัพเดทข้อมูล
function UpdatePromotion(id) {
  const Code_Promotion = document.getElementById("Code_Promotion").value;
  const Descriptions = document.getElementById("Descriptions").value;
  const Discount = document.getElementById("Discount").value;
  const Total = document.getElementById("Total").value;
  const Partner = document.getElementById("Partner").value;
  const Start_date = document.getElementById("Start_date").value;
  const End_date = document.getElementById("End_date").value;
  const data = {
    username: loginData.username,
    password: loginData.password,
    Code_Promotion: Code_Promotion,
    Descriptions: Descriptions,
    Discount: Discount,
    Total: Total,
    Partner: Partner,
    Start_date: Start_date,
    End_date: End_date,
  };

  const url = "http://localhost:3000/updatePromotion/" + id;
  fetch(url, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(JSON.stringify(data));
      if (res.msg === "inserted") {
        Swal.fire({
          icon: "success",
          title: "อัพเดทข้อมูลสำเร็จ",
          text: "ข้อมูลของคุณได้ถูกอัพเดทเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
          showConfirmButton: true,
        }).then(() => {
          location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถอัพเดทข้อมูลได้",
          text: "เนื่องจากผู้ใช้ไม่มีสิทธิ์ในการอัพเดทข้อมูล",
          confirmButtonText: "ตกลง",
          showConfirmButton: true,
        }).then(() => {
          location.reload();
        });
      }
    });
}

// ฟังก์ชันลบข้อมูล
function DeletePromotion(id) {
  const url = "http://localhost:3000/deletePromotion/" + id;
  Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: "คุณจะไม่สามารถย้อนกลับได้!",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#fe7096",
    cancelButtonColor: "#999a9a",
    confirmButtonText: "ใช่ ลบมัน!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.msg === "deleted") {
            Swal.fire({
              icon: "success",
              title: "ลบข้อมูลสำเร็จ",
              text: "ข้อมูลของคุณได้ถูกลบเรียบร้อยแล้ว",
              confirmButtonText: "ตกลง",
              showConfirmButton: true,
            }).then(() => {
              location.reload();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "ไม่สามารถลบข้อมูลได้",
              text: "เนื่องจากผู้ใช้ไม่มีสิทธิ์ในการลบข้อมูล",
              confirmButtonText: "ตกลง",
              showConfirmButton: true,
            }).then(() => {
              location.reload();
            });
          }
        });
    }
  });
}

// ฟังก์ชันแปลงวันที่
function MonthConvert(month) {
  switch (month) {
    case "Jan":
      return "01";
    case "Feb":
      return "02";
    case "Mar":
      return "03";
    case "Apr":
      return "04";
    case "May":
      return "05";
    case "Jun":
      return "06";
    case "Jul":
      return "07";
    case "Aug":
      return "08";
    case "Sept":
      return "09";
    case "Oct":
      return "10";
    case "Nov":
      return "11";
    case "Dec":
      return "12";
    default:
      return undefined;
  }
}
