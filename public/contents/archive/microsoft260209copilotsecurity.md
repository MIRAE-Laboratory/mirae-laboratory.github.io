---
date: 2026-02-12
title: "Copilot Studio agent security: Top 10 risks you can detect and prevent"
category: Technical Tips
type: Blog
language: Korean
tldr:
  - 본 가이드는 Microsoft Copilot Studio를 통해 구축된 AI 에이전트의 활용도가 높아짐에 따라 발생할 수 있는 주요 보안 취약점과 대응 방안을 다룸
  - 프롬프트 주입(Prompt Injection)부터 권한 오용에 이르기까지 에이전트 환경에서 발생 가능한 10대 보안 위험을 상세히 정의하고 분석함
  - 기업이 AI 에이전트를 안전하게 배포하고 운영하기 위해 필수적으로 점검해야 할 보안 메커니즘과 실질적인 방어 전략을 제시하는 것을 목적으로 함
tags:
  - Microsoft
  - Copilot_Studio
  - AI_Security
  - LLM_Safety
  - Agentic_AI
source: https://www.microsoft.com/en-us/security/blog/2026/02/09/prompt-attack-breaks-llm-safety/
---
# Copilot Studio agent 보안: 감지 및 방지 가능한 10대 위험 요소

이 문서는 Microsoft Copilot Studio 에이전트 운영 시 직면할 수 있는 10가지 주요 보안 리스크를 설명하고, 이를 선제적으로 탐지 및 방어하기 위한 구체적인 지침을 제공합니다.

* **프롬프트 주입(Prompt Injection):** 공격자가 악의적인 프롬프트를 입력하여 에이전트의 시스템 프롬프트를 우회하거나, 개발자가 의도하지 않은 명령을 수행하도록 조작하는 위험을 방지해야 합니다.
* **안전하지 않은 출력 처리(Insecure Output Handling):** 에이전트가 생성한 출력을 검증 없이 다른 시스템이나 사용자에게 전달할 경우, 크로스 사이트 스크립팅(XSS)이나 원격 코드 실행 등의 2차 공격으로 이어질 수 있습니다.
* **민감 데이터 유출(Sensitive Data Disclosure):** 에이전트가 학습 데이터나 연결된 지식 베이스 내의 기밀 정보(개인정보, 기업 비밀 등)를 권한이 없는 사용자에게 답변으로 제공할 위험이 존재합니다.
* **과도한 권한 부여(Excessive Agency):** 에이전트에게 필요 이상의 작업 수행 권한이나 데이터 접근 권한을 부여할 경우, 단일 취약점이 전체 시스템의 대규모 침해로 확장될 수 있습니다.
* **부적절한 인증 및 인가(Insecure Authentication/Authorization):** 에이전트가 외부 서비스나 API에 연결될 때 신뢰할 수 없는 인증 방식을 사용하거나 사용자의 권한을 제대로 확인하지 않는 문제를 해결해야 합니다.
* **공급망 취약점(Supply Chain Vulnerabilities):** 타사에서 제작한 플러그인, 커넥터 또는 외부 라이브러리를 에이전트에 통합할 때 발생할 수 있는 보안 허점을 지속적으로 모니터링해야 합니다.
* **모델 거부 서비스(Model Denial of Service):** 에이전트에 과도한 연산을 유발하는 복잡한 쿼리를 반복적으로 보내 리소스를 고갈시키고 정상적인 서비스 운영을 방해하는 공격을 차단해야 합니다.
* **로깅 및 모니터링 부재:** 에이전트와 사용자 간의 상호작용이나 시스템 호출 내역을 기록하지 않으면 보안 사고 발생 시 원인 분석과 침입 탐지가 불가능해집니다.
