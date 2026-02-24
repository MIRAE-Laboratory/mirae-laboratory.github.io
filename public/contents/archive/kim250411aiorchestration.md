---
date: 2025-04-11
title: Artificial intelligence orchestration for text-based ultrasonic simulation via self-review by multi-large language model agents
category: Paper
type: Paper
language: English
tldr:
  - SimNDT 초음파 시뮬레이션을 자연어로 제어하기 위해, 프로그램 기능을 함수 단위로 모듈화하고 LLM이 텍스트 명령을 실행 가능한 시나리오로 변환하는 구조를 제안
  - GUI/스크립트 기반 대비 평균 시뮬레이션 설정 시간을 약 75% 단축하여, 반복 시뮬레이션이 필요한 디지털 트윈 등 시간 민감 응용에서 효율성을 크게 개선
  - LLM 시나리오 생성 실패를 줄이기 위해 self-review 및 다중 에이전트 협업(ground AI)을 도입하여, 벡터 출력 길이 불일치 등 오류율을 23.89%에서 1.48%로 감소
tags:
  - LLM
  - Multi-Agent
  - Self-Review
  - Ground_AI
  - Ultrasonic_Simulation
  - SimNDT
  - Text-Based_Control
  - Natural_Language_Commands
  - Function_Calling
  - Scenario_Generation
  - Error_Reduction
  - Digital_Twin
  - Automation
source: https://doi.org/10.1038/s41598-025-97498-y
country: Republic of Korea
institute: Korea Atomic Energy Research Institute; University of Science & Technology
authors:
  - Soyeon Kim
  - Yonggyun Yu
  - Hogeon Seo
correspondingAuthor: Hogeon Seo
---
> [!Abstract]
> Widely used ultrasonic simulation systems often rely on complex graphical user interfaces (GUIs) or scripting, resulting in substantial time investments and reduced accessibility for new users. In this study, we propose a novel text-based simulation control architecture, which leverages a large language model (LLM) and the ground artificial intelligence (AI) approach to streamline the control of ultrasonic simulation systems.
> By modularizing the functionalities of the SimNDT program into discrete functions and enabling natural language-based command interpretation, the proposed method reduces the average simulation configuration time by approximately 75%. To further mitigate task failures in scenario generation using the LLM, we introduce the ground AI approach, which employs self-review mechanisms and multi-agent collaboration to improve task completion rates.
> In particular, when vectorized output lengths deviate from the standard, we regenerate outputs using multiple LLM agents, reducing the scenario generation error rate from 23.89 to 1.48% and enhancing reliability significantly. These advancements underscore the potential of AI-driven methods in reducing operational costs and enhancing reliability in simulation frameworks.
> By integrating text-based control and Ground AI mechanisms, the proposed approach provides an efficient and scalable alternative to traditional GUI-based control methods, particularly in time-sensitive applications such as digital twin systems.

## Originality (핵심 독창성)

- “초음파 시뮬레이터 제어”를 GUI/스크립트가 아니라 **자연어 기반 오케스트레이션 문제**로 재정의한다.
    
- 단일 LLM이 아니라 **다중 LLM 에이전트 + self-review**를 통해 시나리오 생성 실패를 줄이려는 설계를 전면에 둔다.
    

## Novelty (기술적 새로움)

- SimNDT 기능을 함수 단위로 모듈화하고, LLM이 자연어를 실행 가능한 시나리오로 변환하는 **텍스트 기반 제어 파이프라인**을 제안한다.
    
- self-review 및 멀티에이전트 재생성으로 오류율을 크게 낮춘다고 보고한다(초록에 수치 제시).
    

## Contribution (주요 기여)

- 시뮬레이션 설정 시간을 대폭 단축하는 실용적 근거를 제시한다(초록에서 약 75% 단축 보고).
    
- 시나리오 생성 신뢰성을 높이기 위한 “ground AI(자기검토+협업)” 전략을 실험으로 뒷받침한다.