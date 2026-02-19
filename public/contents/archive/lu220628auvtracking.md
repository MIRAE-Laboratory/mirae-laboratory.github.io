---
date: 2022-06-28
title: Deep Reinforcement Learning-based Trajectory Tracking Control for Underactuated Autonomous Underwater Vehicles
category: Physical AI
type: Paper
language: English
tldr:
- 저구동(Underactuated) 수중 자율 이동정(AUV)의 정밀한 궤적 추적을 위한 심층 강화학습 제어 프레임워크 제안.
- TD3(Twin Delayed Deep Deterministic Policy Gradient) 알고리즘을 적용하여 모델 불확실성 및 외부 교란에 대한 강인성 확보.
- 시뮬레이션을 통해 기존 DDPG 및 PID 제어기 대비 우수한 추적 성능과 수렴 안정성을 입증함.
tags:
- deep_reinforcement_learning
- autonomous_underwater_vehicles
- trajectory_tracking
- TD3_algorithm
- underactuated_systems
- robotics
source: https://ieeexplore.ieee.org/abstract/document/9810961
country: Taiwan
institute: National Taiwan University of Science and Technology
authors:
- Yu-Sheng Lu
- Chih-Chiang Chen
- Cheng-An Ho
---

# Deep Reinforcement Learning-based Trajectory Tracking Control for Underactuated Autonomous Underwater Vehicles

이 논문은 복잡하고 불확실한 수중 환경에서 저구동 수중 자율 이동정(AUV)의 정밀한 궤적 추적을 실현하기 위해 TD3 심층 강화학습 알고리즘을 활용한 제어 전략을 제시합니다. 수중 환경의 비선형성과 외부 교란 속에서도 고전적 제어 방식보다 높은 적응성과 정확도를 유지하는 제어기를 설계하는 것이 핵심 목표입니다.

* 본 연구는 자유도보다 구동기 수가 적은 저구동(Underactuated) 시스템인 AUV의 제어 난제를 해결하기 위해 최신 DRL 기법인 TD3를 도입하였습니다.
* 제안된 제어기는 센서 데이터로부터 직접 제어 명령을 도출하는 엔드-투-엔드(End-to-End) 구조를 채택하여 복잡한 동역학 모델링 의존도를 낮췄습니다.
* 학습 과정에서 추적 오차와 에너지 소비를 동시에 고려한 보상 함수(Reward Function)를 설계하여 효율적이고 안정적인 제어 정책을 학습시켰습니다.
* TD3 알고리즘의 핵심인 쌍둥이 비평가(Twin Critics) 네트워크를 통해 Q-값의 과대평가 문제를 해결함으로써 기존 DDPG 방식보다 안정적인 수렴 성능을 보였습니다.
* 다양한 시뮬레이션 시나리오(나선형 및 곡선 경로 등)에서 시간에 따라 변하는 외부 조류 교란과 파라미터 불확실성에 대한 강인성을 검증하였습니다.
* 비교 실험 결과, 제안된 TD3 기반 제어기는 기존의 PID 제어 및 표준 DDPG 제어 방식에 비해 궤적 추적 오차를 유의미하게 감소시키는 결과를 나타냈습니다.
* 이 기술은 복잡한 수중 탐사, 자원 조사 및 해양 구조물 점검과 같이 정밀한 기동이 필요한 AUV 운용 분야에 기여할 수 있습니다.