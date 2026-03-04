import React from "react";

const NOTE_URL =
  "https://docs.google.com/document/d/1L7CkgDqu9yvjWuqam8thdO2dcEqzUCH7HF_3bOv8rlE/edit?usp=sharing";

const NoteRedirect = () => {
  React.useEffect(() => {
    window.location.replace(NOTE_URL);
  }, []);

  return (
    <main className="section py-5">
      <div className="container text-center">
        <p className="mb-2">노트로 이동 중입니다…</p>
        <p>
          잠시 후 이동하지 않으면{" "}
          <a href={NOTE_URL} target="_blank" rel="noreferrer">
            여기를 클릭
          </a>
          해 주세요.
        </p>
      </div>
    </main>
  );
};

export default NoteRedirect;

