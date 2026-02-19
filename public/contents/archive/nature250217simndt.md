---
date: 2025-02-17
title: A novel text-based simulation control architecture using large language models and ground AI
category: Simulation AI
type: Paper
language: English
tldr:
- LLM 기반의 자연어 명령을 통해 초음파 시뮬레이션(SimNDT)을 제어하는 텍스트 기반 아키텍처를 제안함.
- 자기 복기 및 다중 에이전트 협업을 포함하는 Ground AI 기법을 통해 시나리오 생성 오류율을 23.89%에서 1.48%로 대폭 낮춤.
- 기존 GUI 방식 대비 시뮬레이션 설정 시간을 약 75% 단축하여 디지털 트윈 등 실시간 응용 분야의 효율성을 입증함.
tags:
- LLM
- Simulation_Control
- Ground_AI
- SimNDT
- Ultrasonic_Simulation
- Multi-agent_Systems
- Digital_Twin
source: https://www.nature.com/articles/s41598-025-97498-y
institute: Nature Scientific Reports
---

# A novel text-based simulation control architecture using large language models and ground AI

이 연구는 대규모 언어 모델(LLM)과 Ground AI 접근 방식을 결합하여 복잡한 초음파 시뮬레이션 시스템의 제어를 간소화하고 자동화하는 혁신적인 텍스트 기반 제어 프레임워크를 제안합니다.

* 기존의 GUI 및 스크립팅 기반 초음파 시뮬레이션은 높은 학습 곡선과 반복적인 수동 조작으로 인해 대규모 데이터셋 생성 및 실시간 응용에 한계가 있었음.
* 초음파 NDT 시뮬레이션 툴인 SimNDT의 기능들을 독립적인 호출 함수로 모듈화하여, 사용자가 자연어 명령만으로 복잡한 시뮬레이션 시나리오를 실행할 수 있도록 설계함.
* LLM의 환각(Hallucination) 및 출력 오류를 방지하기 위해 자기 복기(Self-review)와 다중 에이전트 협업(Multi-agent collaboration) 시스템을 포함하는 'Ground AI' 메커니즘을 도입함.
* 시뮬레이션 설정에 소요되는 평균 시간을 기존 방식 대비 약 75% 단축함으로써 운영 효율성을 획기적으로 개선함.
* 벡터화된 출력값의 길이가 표준을 벗어나는 등의 기술적 오류 발생 시, 다중 에이전트가 이를 감지하고 재생성하여 시나리오 생성 오류율을 23.89%에서 1.48%로 감소시킴.
* 이 프레임워크는 디지털 트윈과 같이 신속한 데이터 생성과 시뮬레이션 제어가 필수적인 공학적 의사결정 시스템에 확장 가능한 대안을 제공함.
* 본 연구의 결과는 공학 시뮬레이션 관리 분야에서 AI 기반 도구가 운영 비용을 절감하고 신뢰성을 높이는 데 핵심적인 역할을 할 수 있음을 시사함.