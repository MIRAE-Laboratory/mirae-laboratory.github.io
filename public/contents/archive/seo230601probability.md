---
date: 2023-06-01
title: Probability propagation for faster and efficient point cloud segmentation using a neural network
category: Paper
type: Paper
language: English
tldr:
  - 포인트 클라우드 분할에서 “반복 샘플링-추론”으로 인한 느린 inference를 문제로 두고, 샘플 포인트에서 예측된 확률을 주변 점으로 전파하는 stochastic upsampling(Probability Propagation, PP)을 제안
  - ShapeNet에서 다양한 샘플링 비율/방법과 확률 매핑 분포를 비교하고, NN+PP가 NN 단독보다 빠르고 정확하다고 보고
  - 5% farthest point sampling 조건에서 instance mIoU가 2.457%p 개선되고, 속도는 102배 빠르다고 제시(엣지 AI 적합성 강조)
tags:
  - Point_Cloud_Segmentation
  - Pattern_Recognition_Letters
  - Probability_Propagation
  - Stochastic_Upsampling
  - Edge_AI
  - ShapeNet
  - Sampling
  - mIoU
  - Inference_Speed
  - Open_Access
source: https://doi.org/10.1016/j.patrec.2023.04.010
country: Not specified
institute: Not specified (ScienceDirect landing page)
authors:
  - Hogeon Seo
  - Sangjun Noh
  - Sungho Shin
  - Kyoobin Lee
correspondingAuthor: Not specified (ScienceDirect landing page)
---
> [!Abstract]
> Neural networks (NN) have shown promising performance in point cloud segmentation (PCS). However, the measured points are too numerous to be used as model input at once. It results in a long inference time and high computational cost due to iterative sampling and inference. This study proposes Probability Propagation (PP) as a stochastic upsampling method. PP propagates the predicted probability of a sampled part of a point cloud into the other unpredicted points by considering proximity. By replacing the iterative inference of NN with PP, large point clouds can be dealt with quickly and efficiently. We investigated the effectiveness of PP using the ShapeNet benchmark on various settings: sampling methods (random, farthest point, and Poisson disk sampling) with sampling ratios (5%, 10%, 20%, 39%, and 78%) for NN and the stochastic mapping conditions (uniform, linear, cosine, Gaussian, and exponential distributions) for PP. Using NN with PP achieved higher performance and faster inference speed than when using NN alone. For the farthest point sampling method of 5% sampling ratio, NN+PP improved the instance mIoU by 2.457%p with 102 times faster speed compared to that when using NN alone. The result indicates that PP can significantly contribute to the improvement of performance and efficiency in PCS when used in edge AI systems.

## Originality (핵심 독창성)
- “분할 모델을 더 키우는 것”이 아니라, **샘플 기반 예측을 전체 점으로 확률 전파**해 inference 병목을 줄인다.
- 반복 추론(iterative inference)을 “확률 전파”로 대체하는 발상이 문제 정의에 직접 맞는다.

## Novelty (기술적 새로움)
- 확률 전파를 stochastic mapping(여러 분포)으로 체계화하고, 분포별 성능을 비교한다.
- 극단적 저샘플(5%)에서도 속도(102×)와 성능(+2.457%p mIoU)을 동시에 제시한다.

## Contribution (주요 기여)
- (1) PCS 추론을 가속하는 PP 알고리즘 제안
- (2) 샘플링 방법/비율/확률분포 조건에 대한 비교 실험 제공
- (3) 엣지 환경에서 “빠르고 충분히 정확한” 실용적 파이프라인 제시