---
date: 2023-11-01
title: Symmetry-informed surrogates with data-free constraint for real-time acoustic wave propagation
category: Paper
type: Paper
language: English
tldr:
  - 음향(초음파) 파동전파를 암시적 표현(implicit representation)으로 학습하는 DNN surrogate를 제안하고, 음향의 대칭성(symmetry constraint)을 활용한 physics-informed training residual을 도입
  - COMSOL 기반 FEM 대비 R²가 98% 이상이며, 추론 속도는 약 215배 빠르다고 보고
  - 데이터 라벨/참조해 없이도 적용 가능한 “data-free” 제약 기반 residual로 일반화 성능을 전 입력 방향에서 강화하고, 결함 탐지(real-time flaw detection) 응용 가능성을 제시
tags:
  - Surrogate_Model
  - Acoustic_Wave_Propagation
  - Applied_Acoustics
  - Symmetry_Constraint
  - Physics-Informed_Residual
  - Implicit_Representation
  - COMSOL
  - FEM
  - Real-Time
  - Flaw_Detection
  - Generalization
  - Open_Access
source: https://doi.org/10.1016/j.apacoust.2023.109686
country: Not specified
institute: Not specified (ScienceDirect landing page)
authors:
  - Hee-Sun Choi
  - Yonggyun Yu
  - Hogeon Seo
correspondingAuthor: Not specified (ScienceDirect landing page)
---
> [!Abstract]
> A deep neural network is developed as a symmetry-informed surrogate model to estimate the stress of acoustic waves at any arbitrary location, time, and wave excitation width, as a kind of implicit representation of acoustic wave propagation. To improve the model performance, we suggest a physic-informed training residual by employing the symmetry constraint of acoustics. Compared to the FEM simulation using COMSOL Multiphysics, the R² score of the surrogate model was greater than 98%, and its inference performance was about 215 times faster. The proposed residual can be characterized by three benefits: no architectural changes to the surrogate model are required, no labeled data or reference solutions are necessary, and the generalization ability of the surrogate model is enhanced in all input directions. Numerical investigation validates the superior generalization of the model trained with the symmetry constraint, along with the examination of the regularization rate and sampling approach, the additional hyperparameters induced by the proposed residual. Furthermore, we demonstrate the potential viability of real-time simulations from surrogate models through a practical application of the trained model for flaw detection. The results indicate that the capability of the data-driven surrogate model for generalized implicit representation can be enhanced by adopting the physic-informed training residual.

## Originality (핵심 독창성)
- “대칭성 제약”을 학습 잔차(residual)로 구성해, 모델 구조 변경 없이 surrogate 일반화를 강화한다는 설계가 중심이다.
- 라벨/정답해가 없어도 적용 가능한 “data-free constraint”를 명시적으로 내세운다.

## Novelty (기술적 새로움)
- 음향학의 symmetry constraint를 physics-informed residual로 구현해 학습 신호로 사용한다.
- 속도(215×)와 정확도(R²>0.98)를 함께 보고하며, 실시간 결함 탐지로 연결한다.

## Contribution (주요 기여)
- (1) 실시간을 지향하는 파동전파 surrogate 모델 제시
- (2) data-free residual 기반 일반화 개선의 실증(수치 실험)
- (3) 결함 탐지 적용 예로 “실사용 가능성”을 제시