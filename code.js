// app.js

const ACCOUNT_DB = [
  { studentNo: "20518", name: "홍길동", googleId: "gildong20518@school.go.kr", password: "abc1234" },
  { studentNo: "20519", name: "김철수", googleId: "chulsoo20519@school.go.kr", password: "pw20519!" }
];

const form = document.getElementById("searchForm");
const studentNoInput = document.getElementById("studentNo");
const studentNameInput = document.getElementById("studentName");

const message = document.getElementById("message");
const resultBox = document.getElementById("resultBox");
const googleId = document.getElementById("googleId");
const googlePw = document.getElementById("googlePw");

// ✅ 추가: 눈 버튼
const togglePwBtn = document.getElementById("togglePwBtn");

// ✅ 추가: 현재 비밀번호(원문) 저장 + 보임/숨김 상태
let currentPassword = "";
let isPwVisible = false;

// ✅ 추가: 마스킹 함수 (길이에 따라 적당히 가림)
function maskPassword(pw) {
  if (!pw) return "-";
  // 예: 앞 1글자만 보여주고 나머지 가림 (너무 짧으면 전부 가림)
  if (pw.length <= 2) return "•".repeat(pw.length);
  return pw[0] + "•".repeat(pw.length - 1);
}

// ✅ 추가: PW 표시 갱신 함수
function renderPassword() {
  googlePw.textContent = isPwVisible ? currentPassword : maskPassword(currentPassword);
  togglePwBtn.textContent = isPwVisible ? "🙈" : "👁";
}

resultBox.hidden = true;
message.textContent = "학번과 이름을 입력한 뒤 검색하세요 🙂";

// ✅ 추가: 눈 버튼 클릭 이벤트
togglePwBtn.addEventListener("click", () => {
  if (!currentPassword) return; // 아직 검색 전이면 아무것도 안 함
  isPwVisible = !isPwVisible;
  renderPassword();
});

function findAccount(studentNo, name) {
  return ACCOUNT_DB.find((account) => account.studentNo === studentNo && account.name === name);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const studentNo = studentNoInput.value.trim();
  const studentName = studentNameInput.value.trim();

  resultBox.hidden = true;

  if (studentNo === "" || studentName === "") {
    message.textContent = "학번과 이름을 모두 입력해주세요!";
    message.style.color = "#d33";
    return;
  }

  const account = findAccount(studentNo, studentName);

  if (!account) {
    message.textContent = "일치하는 계정 정보가 없습니다 😥";
    message.style.color = "#d33";
    return;
  }

  // 결과 출력
  googleId.textContent = account.googleId;

  // ✅ 여기서부터 PW는 기본 “숨김”으로 출력
  currentPassword = account.password;
  isPwVisible = false;
  renderPassword();

  resultBox.hidden = false;
  message.textContent = "계정 정보를 찾았습니다!";
  message.style.color = "#2a7";
});
