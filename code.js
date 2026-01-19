/***********************
 * 예시 계정 데이터
 * - 운영 시: 비밀번호 평문 저장/표시는 정말 위험해요.
 * - 최소한 접근 제한(교내망/로그인/권한), 화면 자동 숨김 등을 권장합니다.
 ************************/
const ACCOUNTS = [
  // studentNo는 "학년반번호" 같은 문자열/숫자 문자열로 통일 추천
  { name: "홍길동", studentNo: "20801", id: "s20801@school.go.kr", pw: "Gm20801!" },
  { name: "김하늘", studentNo: "20802", id: "s20802@school.go.kr", pw: "Gm20802!" },
  { name: "이준호", studentNo: "20715", id: "s20715@school.go.kr", pw: "Gm20715!" },
];

/***********************
 * DOM
 ************************/
const $searchForm = document.getElementById("searchForm");
const $nameInput = document.getElementById("nameInput");
const $studentNoInput = document.getElementById("studentNoInput");
const $status = document.getElementById("status");

const $result = document.getElementById("result");
const $outName = document.getElementById("outName");
const $outStudentNo = document.getElementById("outStudentNo");
const $outId = document.getElementById("outId");
const $outPwMasked = document.getElementById("outPwMasked");
const $outPw = document.getElementById("outPw");

const $copyIdBtn = document.getElementById("copyIdBtn");
const $copyPwBtn = document.getElementById("copyPwBtn");
const $togglePwBtn = document.getElementById("togglePwBtn");

// 모달
const $pwModal = document.getElementById("pwModal");
const $pwModalOk = document.getElementById("pwModalOk");
const $pwModalCancel = document.getElementById("pwModalCancel");

/***********************
 * 상태
 ************************/
let currentAccount = null;
let pwVisible = false;

/***********************
 * 유틸
 ************************/
function norm(s) {
  return (s ?? "").toString().trim();
}

function setStatus(msg = "", type = "info") {
  // type: info | error | success
  $status.textContent = msg;

  // 간단하게 색감만 살짝 바꾸고 싶으면 CSS에서 status에 클래스 적용해도 됨
  $status.dataset.type = type;
}

function hideResult() {
  $result.hidden = true;
  $copyIdBtn.disabled = true;
  $copyPwBtn.disabled = true;
  $togglePwBtn.disabled = true;

  currentAccount = null;
  pwVisible = false;

  $outName.textContent = "-";
  $outStudentNo.textContent = "-";
  $outId.textContent = "-";

  $outPw.textContent = "-";
  $outPw.hidden = true;

  $outPwMasked.hidden = false;
  $outPwMasked.textContent = "••••••••";
  $togglePwBtn.textContent = "보기";
}

function showResult(account) {
  currentAccount = account;

  $outName.textContent = account.name;
  $outStudentNo.textContent = account.studentNo;
  $outId.textContent = account.id;

  // PW는 기본 마스킹
  pwVisible = false;
  $outPw.textContent = account.pw;
  $outPw.hidden = true;
  $outPwMasked.hidden = false;
  $outPwMasked.textContent = "••••••••";
  $togglePwBtn.textContent = "보기";

  $result.hidden = false;
  $copyIdBtn.disabled = false;
  $copyPwBtn.disabled = false;
  $togglePwBtn.disabled = false;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    setStatus("복사되었습니다 ✅", "success");
  } catch (e) {
    // fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setStatus("복사되었습니다 ✅", "success");
    } catch {
      setStatus("복사에 실패했어요. 브라우저 권한을 확인해 주세요.", "error");
    }
  }
}

/***********************
 * 검색 로직
 ************************/
function findAccount(name, studentNo) {
  const n = norm(name);
  const s = norm(studentNo);

  // 이름은 공백/대소문자 차이 정도만 허용(한글은 대소문자 없음)
  // 학번은 숫자만 남기기
  const sDigits = s.replace(/[^\d]/g, "");

  return ACCOUNTS.find(a => {
    const an = norm(a.name);
    const as = norm(a.studentNo).replace(/[^\d]/g, "");
    return an === n && as === sDigits;
  }) || null;
}

/***********************
 * 모달 제어
 ************************/
function openPwModal() {
  $pwModal.hidden = false;
}

function closePwModal() {
  $pwModal.hidden = true;
}

/***********************
 * PW 표시 토글
 ************************/
function revealPw() {
  if (!currentAccount) return;

  pwVisible = true;
  $outPw.hidden = false;
  $outPwMasked.hidden = true;
  $togglePwBtn.textContent = "숨기기";

  // 안전장치: 15초 후 자동으로 다시 숨김
  window.clearTimeout(revealPw._timer);
  revealPw._timer = window.setTimeout(() => {
    if (pwVisible) hidePw();
  }, 15000);
}

function hidePw() {
  pwVisible = false;
  $outPw.hidden = true;
  $outPwMasked.hidden = false;
  $togglePwBtn.textContent = "보기";
}

/***********************
 * 이벤트
 ************************/
$searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  setStatus("", "info");
  hidePw(); // 새 검색 시 PW는 항상 숨김

  const name = $nameInput.value;
  const studentNo = $studentNoInput.value;

  // 간단 검증
  if (!norm(name) || !norm(studentNo)) {
    hideResult();
    setStatus("이름과 학번을 모두 입력해 주세요.", "error");
    return;
  }

  const found = findAccount(name, studentNo);
  if (!found) {
    hideResult();
    setStatus("일치하는 정보가 없습니다. 이름/학번을 다시 확인해 주세요.", "error");
    return;
  }

  showResult(found);
  setStatus("검색 완료! (PW는 기본 숨김 상태예요)", "success");
});

// 학번 입력에 숫자만 남기고 싶으면(선택):
$studentNoInput.addEventListener("input", () => {
  // 숫자 이외 제거 (원하면 주석 해제)
  // $studentNoInput.value = $studentNoInput.value.replace(/[^\d]/g, "");
});

$copyIdBtn.addEventListener("click", async () => {
  if (!currentAccount) return;
  await copyToClipboard(currentAccount.id);
});

$copyPwBtn.addEventListener("click", async () => {
  if (!currentAccount) return;
  // PW 복사도 민감하니, 원하면 여기서도 모달 띄우도록 바꿀 수 있음
  await copyToClipboard(currentAccount.pw);
});

$togglePwBtn.addEventListener("click", () => {
  if (!currentAccount) return;

  // 이미 보이는 중이면 바로 숨김
  if (pwVisible) {
    hidePw();
    setStatus("비밀번호를 숨겼습니다.", "info");
    return;
  }

  // 처음 '보기'일 땐 모달 확인
  openPwModal();
});

$pwModalOk.addEventListener("click", () => {
  closePwModal();
  revealPw();
  setStatus("비밀번호 표시 중 (15초 후 자동 숨김)", "info");
});

$pwModalCancel.addEventListener("click", () => {
  closePwModal();
});

$pwModal.addEventListener("click", (e) => {
  // 바깥(Backdrop) 클릭 시 닫기
  if (e.target && e.target.dataset && e.target.dataset.close === "true") {
    closePwModal();
  }
});

// ESC로 모달 닫기
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$pwModal.hidden) closePwModal();
});

// 초기 상태
hideResult();
setStatus("이름과 학번을 입력하고 검색해 주세요.", "info");
$nameInput.focus();
