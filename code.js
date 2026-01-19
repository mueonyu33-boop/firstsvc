// app.js

// 1️⃣ 계정 데이터 (예시)
// 실제 사용 시 이 배열만 수정하면 됨
const ACCOUNT_DB = [
  {
    studentNo: "20518",
    name: "홍길동",
    googleId: "gildong20518@school.go.kr",
    password: "abc1234"
  },
  {
    studentNo: "20519",
    name: "김철수",
    googleId: "chulsoo20519@school.go.kr",
    password: "pw20519!"
  }
];

// 2️⃣ DOM 요소 가져오기
const form = document.getElementById("searchForm");
const studentNoInput = document.getElementById("studentNo");
const studentNameInput = document.getElementById("studentName");

const message = document.getElementById("message");
const resultBox = document.getElementById("resultBox");
const googleId = document.getElementById("googleId");
const googlePw = document.getElementById("googlePw");

// 3️⃣ 초기 상태
resultBox.hidden = true;
message.textContent = "학번과 이름을 입력한 뒤 검색하세요 🙂";

// 4️⃣ 검색 함수
function findAccount(studentNo, name) {
  return ACCOUNT_DB.find(
    (account) =>
      account.studentNo === studentNo &&
      account.name === name
  );
}

// 5️⃣ 폼 제출 이벤트 (버튼 클릭 + 엔터)
form.addEventListener("submit", function (e) {
  e.preventDefault(); // 새로고침 방지

  const studentNo = studentNoInput.value.trim();
  const studentName = studentNameInput.value.trim();

  resultBox.hidden = true;

  // 입력값 체크
  if (studentNo === "" || studentName === "") {
    message.textContent = "학번과 이름을 모두 입력해주세요!";
    message.style.color = "#d33";
    return;
  }

  // 계정 검색
  const account = findAccount(studentNo, studentName);

  if (!account) {
    message.textContent = "일치하는 계정 정보가 없습니다 😥";
    message.style.color = "#d33";
    return;
  }

  // 결과 출력
  googleId.textContent = account.googleId;
  googlePw.textContent = account.password;

  resultBox.hidden = false;
  message.textContent = "계정 정보를 찾았습니다!";
  message.style.color = "#2a7";
});
