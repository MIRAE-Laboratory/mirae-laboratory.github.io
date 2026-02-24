---
date: 2025-04-21
title: Restoration of multi-channel signal loss using autoencoder with recursive input strategy
category: Paper
type: Paper
language: English
tldr:
  - 다채널 센서 데이터에서 무작위·연속적인 결손/오염이 발생할 때 채널 간 상관을 충분히 반영하지 못하는 기존 복원 한계를 문제로 설정
  - 오토인코더 출력(복원값)을 다시 입력으로 재귀적으로 넣어 추정치를 점진적으로 개선하는 복원 알고리즘과, 개선이 미미해지면 자동 종료하는 동적 종료 기준을 제안
  - 다양한 다변량 센서 데이터/결손 시나리오에서 단발성(one-shot) 오토인코더 복원보다 정확도와 계산 효율을 모두 개선하여, 복잡 센서 네트워크의 데이터 무결성 확보에 적합함을 보임
tags:
  - Autoencoder
  - Missing_Data
  - Data_Restoration
  - Multi-Channel
  - Multivariate_Sensor_Data
  - Recursive_Input_Strategy
  - Dynamic_Termination
  - Iterative_Refinement
  - Sensor_Networks
  - Data_Integrity
  - Industrial_AI
  - RMSE
source: https://doi.org/10.1038/s41598-025-98374-5
country: Republic of Korea
institute: Korea Atomic Energy Research Institute; University of Science & Technology
authors:
  - Jaejun Lee
  - Yonggyun Yu
  - Hogeon Seo
correspondingAuthor: Hogeon Seo
---
> [!Abstract]
> Multi-channel sensor data often suffer from missing or corrupted values due to sensor failures, communication disruptions, or environmental interference. These issues severely limit the accuracy of intelligent systems relying on sensor data integration. Existing data restoration techniques often fail to capture complex correlations among sensor channels, especially when data losses occur randomly and continuously.
> To overcome these limitations, we propose an autoencoder-based data recovery algorithm that recursively feeds reconstructed outputs back into the model to progressively refine estimates. A dynamic termination criterion monitors reconstruction improvements, automatically stopping iterations when further refinements become negligible. This recursive input strategy significantly enhances restoration accuracy and computational efficiency compared to conventional single-step methods.
> Experiments on multivariate sensor datasets show that the proposed method significantly outperforms the one-time autoencoder restoration method and maintains robust performance across diverse datasets and missing data scenarios. This approach provides a scalable and adaptable solution to ensure data integrity in complex sensor networks, enabling improved reliability and operational efficiency in industrial and technological applications.

## Originality (핵심 독창성)

- 다채널 신호 결손을 “한 번의 복원”이 아니라 **복원값을 다시 넣어 점진적으로 개선하는 과정**으로 본다.
    
- 복원 반복을 무한정 늘리지 않고, **개선이 멈추면 자동 종료**하는 운용 관점을 포함한다.
    

## Novelty (기술적 새로움)

- 오토인코더 출력(추정치)을 입력으로 재귀 투입하는 **recursive input strategy**를 제안한다.
    
- 반복 개선의 이득이 작아지면 멈추는 **dynamic termination criterion**을 함께 제안한다.
    

## Contribution (주요 기여)

- 다양한 결손 시나리오에서 단발성 복원 대비 정확도와 계산 효율을 개선했다고 보고한다.
    
- 다채널 센서 네트워크의 데이터 무결성 확보에 직접 연결되는 응용 방향을 제시한다.