import React from "react";
// Styles
import styled from "styled-components";
// State
// Components
import { Element } from "react-scroll";
import { Col, Container, Row } from "react-bootstrap";
import Title from "./Title";

const baseUrl = process.env.PUBLIC_URL || "";
const bannerUrl = `${baseUrl}/content/files/MIRAE_Banner.png`;

// #region styled-components
const StyledIntroduction = styled.section`
  p {
    font-size: 1.25rem;
  }
  .img {
    width: 18rem;
    height: 18rem;
  }
`;
// #endregion

// #region component
const Introduction = () => {
  return (
    <Element name={"Introduction"} id="Introduction">
      <StyledIntroduction className="section">
        <Container>
          <div className="text-center w-100 mb-3">
            <img
              src={bannerUrl}
              alt="MIRAE Lab"
              className="w-100"
              style={{ maxHeight: "200px", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div className="d-flex flex-column justify-content-center text-center mb-4">
            <p className="h5 text-muted mb-1">
              과학기술연합대학원대학교(UST) · 한국원자력연구원 스쿨 · 인공지능 전공
            </p>
            <Title size="h2" text="MIRAE :: 멀티모달 지능추론 및 자율진단" />
            <p className="h5 text-muted mt-2">
              Multimodal Intelligent Reasoning &amp; Autonomous Evaluation
            </p>
          </div>
          <Row className="align-items-center mt-5">
            <Col className="d-flex flex-column text-center">
              <Container className="text-start">
                <p className="mb-3">
                  멀티모달 지능 추론 및 고속 시뮬레이션을 위한 AI 원천기술 연구
                </p>
                <ul className="mb-4">
                  <li>멀티모달 데이터 융합 및 이를 바탕으로 한 예측 또는 판독을 가속화 하는 인공지능</li>
                  <li>시뮬레이션 가속화를 위한 물리 정보 기반 인공신경망과 해석 시뮬레이션 융합 기술</li>
                  <li>시뮬레이션 기반 가상 환경에 대한 모델 학습 후 현실 도메인에 대한 적응 학습 기술</li>
                  <li>시뮬레이션 환경과 상호작용하는 인공지능과 최적화 기법을 융합한 공학 문제 해결</li>
                </ul>
                <p className="mb-3">
                  멀티모달 센서를 활용해 지능적으로 데이터 수집이 가능한 하드웨어 플랫폼 및
                  이를 시뮬레이션을 수행할 수 있는 디지털 트윈 플랫폼 연구 개발
                </p>
                <p className="mb-3">
                  멀티모달 데이터 융합 AI 플랫폼을 통해 가상 환경과 실제 환경의 데이터를 수집 및
                  복합 추론이 가능한 Strong AI 원천기술을 선도하며 Intelligent Sensing 및 Extended Reality 분야에 응용
                </p>
                <p className="mb-0">
                  시뮬레이션 기반 도메인 적응 및 데이터 불확실성 학습 기술, 설명 가능한 AI 연구 개발
                </p>
                <div className="text-center w-100 mt-4">
                  <img
                    src={`${baseUrl}/content/files/Research_Interests.png`}
                    alt="Research Interests"
                    className="w-100"
                    style={{ maxWidth: "100%", objectFit: "contain" }}
                  />
                </div>
              </Container>
            </Col>
          </Row>
        </Container>
      </StyledIntroduction>
    </Element>
  );
};

// #endregion

export default Introduction;
