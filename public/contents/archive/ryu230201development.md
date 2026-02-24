---
date: 2023-02-01
title: Development of deep autoencoder-based anomaly detection system for HANARO
category: Paper
type: Paper
language: English
tldr:
  - KAERI의 다목적 연구로(HANARO) 안정 운전을 지원하기 위해, 다중 센서 데이터를 수집·시각화·상태분석·이상탐지까지 포함하는 딥러닝 기반 통합 시스템을 제안
  - deep autoencoder 기반 이상탐지 모델과 함께 통신/시각화/이상탐지 모듈로 구성된 프로토타입을 2021년에 현장 구현했다고 보고
  - 과거 데이터 및 합성 이상(synthetic anomalies) 평가에서 19건 이상 사건 중 12건을 사전 또는 적시에 탐지했다고 제시
tags:
  - Anomaly_Detection
  - Autoencoder
  - Nuclear_Engineering_and_Technology
  - Research_Reactor
  - HANARO
  - KAERI
  - Sensor_Data
  - Monitoring_System
  - Prototype_Implementation
  - Open_Access
source: https://doi.org/10.1016/j.net.2022.10.009
country: South Korea
institute: Not specified (ScienceDirect landing page; KAERI mentioned in abstract)
authors:
  - Seunghyoung Ryu
  - Byoungil Jeon
  - Hogeon Seo
  - Minwoo Lee
  - Jin-Won Shin
  - Yonggyun Yu
correspondingAuthor: Not specified (ScienceDirect landing page)
---
> [!Abstract]
> The high-flux advanced neutron application reactor (HANARO) is a multi-purpose research reactor at the Korea Atomic Energy Research Institute (KAERI). HANARO has been used in scientific and industrial research and developments. Therefore, stable operation is necessary for national science and industrial prospects. This study proposed an anomaly detection system based on deep learning, that supports the stable operation of HANARO. The proposed system collects multiple sensor data, displays system information, analyzes status, and performs anomaly detection using deep autoencoder. The system comprises communication, visualization, and anomaly-detection modules, and the prototype system is implemented on site in 2021. Finally, an analysis of the historical data and synthetic anomalies was conducted to verify the overall system; simulation results based on the historical data show that 12 cases out of 19 abnormal events can be detected in advance or on time by the deep learning AD model.

## Originality (핵심 독창성)
- “모델 성능”만이 아니라, **현장 운전 지원을 위한 end-to-end 시스템(수집–시각화–분석–탐지)**을 논문 기여로 명확히 둔다.
- 실제 원자로 운전 맥락에서 ‘탐지 시점(사전/적시)’을 성능 기준으로 제시한다.

## Novelty (기술적 새로움)
- deep autoencoder를 이상탐지 코어로 두되, 운용 관점에서 통신/시각화 모듈까지 포함한 시스템 공학적 설계를 제시한다.
- 2021년 현장 프로토타입 구현을 명시하여 “실증”을 전면에 둔다.

## Contribution (주요 기여)
- (1) HANARO 운전 지원용 딥러닝 이상탐지 시스템 아키텍처 제안
- (2) 현장 프로토타입 구현 및 데이터 기반 검증 제시
- (3) 19건 이상 사건 중 12건 사전/적시 탐지라는 운영 관점 지표를 보고