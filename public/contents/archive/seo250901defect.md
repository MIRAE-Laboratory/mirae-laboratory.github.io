---
date: 2025-09-01
title: Defect estimation using surrogate-based Monte Carlo Bayesian optimization
category: Paper
type: Paper
language: English
tldr:
  - 유한요소 기반 파동전파를 신경망 surrogate로 근사하고, Monte Carlo Bayesian optimization으로 결함 깊이/폭을 직접 추정하는 “Composite AI” 접근을 제안
  - surrogate가 FE 해석 대비 70,000배 이상 빠르며, 신호처리 알고리즘 없이도 목표 출력과의 유사도 최적화로 결함 치수를 추정
  - 저 SNR(잡음 환경)에서도 깊이 98.5%, 폭 90%를 1 mm 이하 오차 기준으로 달성하며, R² 기반 유사도 지표가 안정적으로 작동함을 보고
tags:
  - Surrogate_Model
  - Monte_Carlo
  - Bayesian_Optimization
  - NDT
  - Ultrasonic_Testing
  - Acoustic_Wave_Propagation
  - Similarity_Metric
  - R2
  - Noisy_Environment
  - Real-Time
  - Open_Access
source: https://doi.org/10.1016/j.measurement.2025.117449
country: Not specified (see full text/PDF)
institute: Not specified (ScienceDirect landing page)
authors:
  - Hogeon Seo
  - Yonggyun Yu
correspondingAuthor: Not specified (ScienceDirect landing page)
---
> [!Abstract]
> This study presents a novel composite AI approach that integrates Monte Carlo Bayesian optimization with a fast neural network surrogate of acoustic wave propagation to estimate the depth and width of defects in noisy nondestructive testing (NDT). The surrogate model, trained on finite element simulations, predicts von Mises stress from inputs of excitation width, material coordinates, and propagation time—delivering outputs more than 70,000 times faster than direct numerical analysis.
> By systematically adjusting the surrogate inputs to match arbitrarily given (target) outputs, the optimizer identifies the depth and width of the defect without relying on signal-processing algorithms. Experimental evaluations demonstrate over 98.5% and 90% accuracy in estimating defect depth and width (with less than 1 mm error, respectively), even in challenging low signal-to-noise conditions.
> Comparative evaluations using different similarity metrics (, , cosine similarity, inverted MSE, or inverted MAE) indicate that Monte Carlo Bayesian optimization guided by the -metric consistently delivers robust and stable performance, underscoring its resilience to high noise levels.
> These results support the potential for real-time, high-accuracy ultrasonic testing for defects while simultaneously reducing computational demands and minimizing the need for specialized, domain-specific algorithm development.