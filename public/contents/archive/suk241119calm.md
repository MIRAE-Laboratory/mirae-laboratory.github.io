---
date: "2024-11-19"
title: "LLM의 시대가 가고 CALM의 시대가 온다"
category: Generative AI
type: Article
language: Korean
tldr:
- 기존 LLM의 토큰 단위 예측 한계를 극복하기 위해 연속적 벡터 단위로 예측하는 CALM 모델 제안
- 텐센트 AI와 칭화대가 공동 개발하여 연산량을 44% 절감하고 토큰 예측 단계를 4배 단축
- 이산적 기호 나열에서 벗어나 의미의 흐름(아이디어 단위)으로 사고하는 새로운 패러다임 제시
tags:
- LLM
- CALM
- AI
- 텐센트
- 칭화대
- 인공지능
- 벡터_예측
source: https://www.linkedin.com/posts/suk-hyun-k-31ba9b369_tsatmi-qzustwtps-llm-activity-7391569501068316672-e8Sn?utm_source=share&utm_medium=member_desktop&rcm=ACoAABP29JEBXb3L3IGz3S241iD4_fxC7Fuop24
country: China
institute: Tencent AI, Tsinghua University
authors:
- Suk Hyun K.
---

# LLM의 시대가 가고 CALM의 시대가 온다

텐센트 AI와 칭화대학이 공동 발표한 'CALM'은 기존 LLM의 토큰 단위 예측 방식에서 벗어나 연속적인 벡터 단위로 언어를 처리하는 혁신적인 구조를 제안합니다. 이는 언어를 단순한 기호의 나열이 아닌 연속적인 의미의 흐름으로 다루어 인공지능의 사고 방식을 근본적으로 재설계하려는 시도입니다.

* 기존 LLM은 '다음 토큰(next-token)'을 하나씩 예측하는 구조적 병목 때문에 모델 크기를 키워도 속도와 효율성 면에서 물리적 한계가 존재함.
* CALM(Continuous Autoregressive Language Model)은 고정밀 오토인코더(autoencoder)를 통해 여러 개의 토큰(K개)을 하나의 연속 벡터로 압축하여 예측함.
* 압축된 벡터로부터 원래의 토큰을 99.9% 이상의 정확도로 복원할 수 있으며, 이를 통해 단어 단위가 아닌 '아이디어 단위'의 추론이 가능해짐.
* 이 방식을 통해 토큰 예측 단계를 약 4배 줄였으며, 전체 연산량을 기존 방식 대비 44% 절감하는 성과를 거둠.
* 전통적인 언어모델 지표인 perplexity 대신 모델의 신뢰도와 예측 일관성을 측정하는 'BrierLM'이라는 새로운 성능 지표를 도입함.
* Softmax나 확률적 샘플링에 의존하지 않는 에너지 기반 트랜스포머 구조를 사용하여 어휘 크기의 제한이 없는 완전한 연속 학습 환경을 구축함.
* 언어를 조각난 기호가 아닌 연속적 흐름으로 처리함으로써 인공지능이 '계산'을 넘어 '사고의 스트리밍' 단계로 진화하는 방향을 제시함.