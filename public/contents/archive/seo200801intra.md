---
date: 2020-08-01
title: Intra- And Inter-Epoch Temporal Context Network (IITNet) Using Sub-Epoch Features for Automatic Sleep Scoring on Raw Single-Channel EEG
category: Paper
type: Paper
language: English
tldr:
  - IITNet은 단일 채널 원시 EEG로부터 sub-epoch 수준 특징을 Residual Network로 추출하고, BiLSTM을 통해 intra- 및 inter-epoch 시간 문맥을 학습하여 자동 수면 단계 분류를 수행
  - SleepEDF, MASS, SHHS 데이터셋에서 최대 10 epoch까지 확장 실험을 수행한 결과, 정확도 약 84–87%, MF1 약 78–81%, κ 약 0.78–0.81로 최신 기법과 동등한 성능을 달성
  - 약 4 epoch(2분)만 고려해도 성능이 충분히 향상되었으며, 특히 N1·N2·REM 단계의 F1이 유의하게 개선되어, 최근 2분 EEG 활용이 효율성과 신뢰성 측면에서 합리적임을 보임
tags:
  - deep_learning
  - GitHub
  - Automatic_Sleep_Scoring
  - Raw_Single-Channel_EEG
  - Epoch
  - Sub-Epoch
  - Intra-Epoch_Temporal_Context
  - Inter-Epoch_Temporal_Context
  - Temporal_Context_Learning
  - Residual_Neural_Network
  - Bidirectional_LSTM
  - Sequence_Length
  - SleepEDF_Dataset
  - MASS_Dataset
  - SHHS_Dataset
  - Accuracy
  - Macro_F1
  - Cohens_Kappa
source: https://doi.org/10.1016/j.bspc.2020.102037
country: South Korea
institute: Gwangju Institute of Science and Technology
authors:
  - Hogeon Seo
  - Seunghyeok Back
  - Seongju Lee
  - Deokhwan Park
  - Tae Kim
correspondingAuthor: Kyoobin Lee
---
> [!Abstact]
> A deep learning model, named IITNet, is proposed to learn intra- and inter-epoch temporal contexts from raw single-channel EEG for automatic sleep scoring. To classify the sleep stage from half-minute EEG, called an epoch, sleep experts investigate sleep-related events and consider the transition rules between the found events. Similarly, IITNet extracts representative features at a sub-epoch level by a residual neural network and captures intra- and inter-epoch temporal contexts from the sequence of the features via bidirectional LSTM. The performance was investigated for three datasets as the sequence length ( L ) increased from one to ten. IITNet achieved the comparable performance with other state-of-the-art results. The best accuracy, MF1, and Cohen's kappa ( κ ) were 83.9%, 77.6%, 0.78 for SleepEDF ( L  = 10), 86.5%, 80.7%, 0.80 for MASS ( L  = 9), and 86.7%, 79.8%, 0.81 for SHHS ( L  = 10), respectively. Even though using four epochs, the performance was still comparable. Compared to using a single epoch, on average, accuracy and MF1 increased by 2.48%p and 4.90%p and F1 of N1, N2, and REM increased by 16.1%p, 1.50%p, and 6.42%p, respectively. Above four epochs, the performance improvement was not significant. The results support that considering the latest two-minute raw single-channel EEG can be a reasonable choice for sleep scoring via deep neural networks with efficiency and reliability. Furthermore, the experiments with the baselines showed that introducing intra-epoch temporal context learning with a deep residual network contributes to the improvement in the overall performance and has the positive synergy effect with the inter-epoch temporal context learning.

## Originality (핵심 독창성)

- 수면 전문가의 판독 논리를 모사해 **epoch 내부 사건(intra) + epoch 간 전이(inter)**를 동시에 학습하는 문제로 정식화한다.
    
- 30초 epoch를 더 쪼갠 **sub-epoch 표현**을 핵심 단위로 사용한다.
    

## Novelty (기술적 새로움)

- sub-epoch 특징을 ResNet으로 추출하고, BiLSTM으로 intra/inter temporal context를 학습하는 결합 구조를 제안한다.
    
- L(1~10 epoch)로 문맥 길이를 확장하며 성능 포화 지점을 실험적으로 제시한다(“2분 EEG면 충분” 결론).
    

## Contribution (주요 기여)

- SleepEDF/MASS/SHHS에서 SOTA 수준 성능을 보고하고, 특히 N1·N2·REM F1 향상을 강조한다.
    
- “최근 약 2분(4 epoch 수준)”이 효율·신뢰성 균형점이라는 실무적 가이드를 제공한다.

IITNet is a deep learning model for automatic sleep stage scoring using raw single-channel EEG. It is designed to mimic how human experts use both within-epoch patterns and transitions across epochs when labeling sleep stages.

* IITNet splits each 30-second EEG epoch into multiple sub-epochs and uses a residual CNN to extract **sub-epoch** feature vectors.
* A bidirectional LSTM then models intra-epoch temporal context (the sequence of sub-epochs within one epoch) and inter-epoch temporal context (sequences of multiple consecutive epochs).
* The model is evaluated on three public datasets (SleepEDF, MASS, SHHS) while varying the sequence length L**L** from 1 to 10 epochs, i.e., how many past epochs are jointly considered.
* IITNet achieves performance comparable to or better than state-of-the-art methods, with best accuracies around 84–87%, macro F1 around 78–81%, and Cohen’s kappa around 0.78–0.81 depending on the dataset.
* Considering about 2 minutes of recent EEG (roughly 4–10 epochs) yields clear gains over a single epoch, but gains saturate beyond four epochs, indicating that a limited temporal window is sufficient and efficient.
* Ablation and baseline comparisons show that modeling intra-epoch temporal context with a deep ResNet significantly improves overall performance and has a synergistic effect when combined with inter-epoch temporal context via BiLSTM.
