import React from "react";
import styled from "styled-components";

const TitleDiv = styled.div`
  display: inline-block;
  max-width: 90vw;
  word-wrap: break-word;
  margin: 0.5rem 0;
  .underline {
    height: 0.25rem;
    width: 75%;
    min-width: 3rem;
    border-radius: 0.25rem;
    margin: 0 auto;
    background: ${({ theme }) =>
      theme?.name === "light"
        ? "linear-gradient(to right, var(--bs-primary), #D3D3D3)"
        : "linear-gradient(to left, var(--bs-primary), var(--bs-light))"};
  }
`;

const Title = ({ size = "h1", text }) => (
  <TitleDiv>
    {size === "h1" ? <h1 className="title">{text}</h1> : <h2 className="title">{text}</h2>}
    <div className="underline" />
  </TitleDiv>
);

export default Title;
