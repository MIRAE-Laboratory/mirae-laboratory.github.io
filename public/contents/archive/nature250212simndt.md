---
date: "2025-02-12"
title: "A novel text-based simulation control architecture leveraging large language models and ground AI"
category: Paper
type: Journal
language: English
tldr:
- LLM과 Ground AI를 활용하여 자연어 명령으로 초음파 시뮬레이션을 제어하는 새로운 텍스트 기반 아키텍처를 제안함.
- 기존 GUI 방식 대비 시뮬레이션 설정 시간을 약 75% 단축하여 복잡한 공학 시뮬레이션의 효율성을 크게 개선함.
- 멀티 에이전트 협업 및 자기 검토 메커니즘을 통해 시나리오 생성 오류율을 23.89%에서 1.48%로 대폭 낮춤.
tags:
- LLM
- ground_AI
- ultrasonic_simulation
- SimNDT
- multi-agent_system
- automation
source: https://www.nature.com/articles/s41598-025-97498-y
---

# A novel text-based simulation control architecture leveraging large language models and ground AI

이 논문은 복잡한 GUI나 스크립팅 대신 자연어 명령으로 초음파 시뮬레이션을 제어할 수 있는 LLM 기반 아키텍처를 제안하며, Ground AI 기법을 통해 시스템의 신뢰성과 효율성을 동시에 확보했습니다.

* 초음파 NDT(비파괴 검사) 시뮬레이션 도구인 SimNDT의 기능을 모듈화하여 LLM이 자연어 입력을 해석하고 개별 함수를 호출할 수 있는 텍스트 기반 제어 프레임워크를 구축했습니다.
* 제안된 방식을 통해 평균 시뮬레이션 구성 시간을 기존 GUI 기반 방식 대비 약 75% 단축하여 데이터 생성의 효율성을 극대화했습니다.
* LLM의 작업 실패와 오류를 방지하기 위해 자기 검토(Self-review) 및 멀티 에이전트 협업 메커니즘을 포함한 'Ground AI' 접근 방식을 도입했습니다.
* 출력된 데이터의 벡터 길이가 표준에서 벗어날 경우 멀티 에이전트가 출력을 재생성하도록 설계하여, 시나리오 생성 오류율을 기존 23.89%에서 1.48%로 획기적으로 감소시켰습니다.
* 이 시스템은 전문가의 복잡한 조작 없이도 "너비 10, 높이 5인 직사각형 객체의 초음파 전파 시뮬레이션"과 같은 직관적인 명령만으로 정교한 시뮬레이션을 수행할 수 있습니다.
* 본 연구의 결과는 디지털 트윈 시스템과 같이 시간 민감도가 높은 응용 분야에서 AI 기반 자동화 도구가 전통적인 공학 시뮬레이션 관리 방식을 대체할 수 있는 가능성을 입증했습니다.