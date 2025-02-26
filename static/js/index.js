document
  .getElementById("userForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/addUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("유저가 추가되었습니다!");
      location.reload();
    } else {
      alert("추가 실패");
    }
  });

async function deleteUser(id) {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  const response = await fetch(`/api/${id}`, { method: "DELETE" });
  if (response.ok) {
    alert("유저가 삭제되었습니다!");
    location.reload();
  } else {
    alert("삭제 실패");
  }
}

async function editUser(id) {
  const newUsername = prompt("새로운 유저명을 입력하세요:");
  if (!newUsername) return;

  const response = await fetch(`/api/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: newUsername }),
  });

  if (response.ok) {
    alert("유저 정보가 수정되었습니다!");
    location.reload();
  } else {
    alert("수정 실패");
  }
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// "오늘 하루 보지 않기" 클릭 시 서버에 요청하여 쿠키 설정
function closePopupForToday() {
  fetch("/close-popup")
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      closePopup();
    });
}
