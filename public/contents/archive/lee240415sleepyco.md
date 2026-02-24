---
date: 2024-04-15
title: "SleePyCo: Automatic sleep scoring with feature pyramid and contrastive learning"
category: Paper
type: Paper
language: English
tldr:
  - 단일 채널 EEG 기반 자동 수면단계 분류에서, multi-scale EEG 패턴을 다루기 위해 feature pyramid와 전용 backbone(SleePyCo-backbone)을 제안
  - supervised contrastive learning을 결합하여, 유사 단계 간(특히 N1/REM) 구분력을 높이는 표현 학습을 수행
  - 4개 공개 데이터셋 비교에서 기존 단일채널 EEG 기반 프레임워크 대비 일관되게 성능 우위를 보고하며, 코드 공개를 제공
tags:
  - Automatic_Sleep_Scoring
  - Single-Channel_EEG
  - Feature_Pyramid
  - Supervised_Contrastive_Learning
  - Multiscale_Representation
  - GitHub
  - Expert_Systems_with_Applications
  - Open_Access
source: https://doi.org/10.1016/j.eswa.2023.122551
country: Not specified (ScienceDirect landing page)
institute: Not specified (ScienceDirect landing page)
authors:
  - Seongju Lee
  - Yeonguk Yu
  - Seunghyeok Back
  - Hogeon Seo
  - Kyoobin Lee
correspondingAuthor: Not specified (ScienceDirect landing page)
---
> [!Abstract]
> Automatic sleep scoring is essential for the diagnosis and treatment of sleep disorders and enables longitudinal sleep tracking in home environments. Conventionally, learning-based automatic sleep scoring on single-channel electroencephalogram (EEG) is actively studied because obtaining multi-channel signals during sleep is difficult.
> However, learning representation from raw EEG signals is challenging owing to the following issues: (1) sleep-related EEG patterns occur on different temporal and frequency scales and (2) sleep stages share similar EEG patterns. To address these issues, we propose an automatic sleep scoring framework that incorporates (1) a feature pyramid and (2) supervised contrastive learning, named SleePyCo.
> For the feature pyramid, we propose a backbone network named SleePyCo-backbone to consider multiple feature sequences on different temporal and frequency scales. Supervised contrastive learning allows the network to extract class discriminative features by minimizing the distance between intra-class features and simultaneously maximizing that between inter-class features.
> Comparative analyses on four public datasets demonstrate that SleePyCo consistently outperforms existing frameworks based on single-channel EEG. Extensive ablation experiments show that SleePyCo exhibited an enhanced overall performance, with significant improvements in discrimination between sleep stages, especially for N1 and rapid eye movement (REM). Source code is available at https://github.com/gist-ailab/SleePyCo.

## Originality (핵심 독창성)

- 단일 채널 EEG 수면분류에서 핵심 난점(다중 스케일 패턴, 단계 간 유사성)을 **표현학습 문제**로 정리하고, 이를 위한 구조를 제시한다.
    
- 분류 성능만이 아니라 **N1–REM 같은 혼동 구간의 분리**를 중심 목표로 둔다.
    

## Novelty (기술적 새로움)

- **Feature pyramid + 전용 backbone(SleePyCo-backbone)**로 시간·주파수 스케일이 다른 특징 시퀀스를 동시에 다룬다.
    
- **Supervised contrastive learning**을 결합해 클래스 분리도를 강화한다.
    

## Contribution (주요 기여)

- 4개 공개 데이터셋 비교에서 기존 단일채널 EEG 프레임워크 대비 일관된 성능 우위를 보고한다.
    
- N1/REM 구분 성능 개선을 ablation으로 보여주며, 코드 공개를 제공한다.