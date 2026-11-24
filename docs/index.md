---
layout: home

hero:
  name: Gherkin 从零到一
  text: BDD 行为描述语言系列教程
  tagline: 不需要任何 BDD / 自动化测试经验 —— 从「为什么会有 Gherkin」讲到用 Cucumber 把特性文件真正跑起来
  image:
    src: /logo.svg
    alt: Gherkin 教程
  actions:
    - theme: brand
      text: 开始阅读
      link: /guide/
    - theme: alt
      text: 语法详解
      link: /guide/02-syntax
    - theme: alt
      text: 案例合集
      link: /guide/06-case-studies

features:
  - title: 面向纯小白
    details: 从 TDD 的痛点讲到 BDD 的诞生，不预设你懂 Cucumber、懂自动化测试，术语第一次出现都会解释。
  - title: 语法全覆盖
    details: Feature / Rule / Background / Scenario、Given-When-Then、场景大纲、数据表、DocString、Tags，含完整中文关键词。
  - title: 重点讲「怎么写得对」
    details: 三层拆解、GWT 语义纪律、声明式与命令式之分、八大反模式清单，配可对照的改造示例。
  - title: 真能跑起来
    details: Java + Cucumber 从 Maven 工程、Step Definitions 到 Hooks、报告，逐步可复现。
  - title: 多语言落地
    details: Cucumber-JS、behave、Reqnroll 的接入方式与选型建议，同一套特性文件跨语言复用。
  - title: 拿来即用的案例
    details: ATM 取款、电商购物车、登录回归集、下单 API、全中文工程五个完整业务形态。
---

## 六篇导航

| 篇章 | 主题 | 适合谁 |
| --- | --- | --- |
| [第 1 篇 · 认识 Gherkin](/guide/01-what-is-gherkin) | 背景、定义、生态、适用边界 | 所有人 |
| [第 2 篇 · 语法详解](/guide/02-syntax) | 全部语法元素与中文关键词 | 产品 / 测试 / 开发 |
| [第 3 篇 · 写出好场景](/guide/03-writing-scenarios) | 方法论与反模式 | 产品 / 测试 / 技术负责人 |
| [第 4 篇 · Cucumber 实战（Java）](/guide/04-cucumber-java) | 工程搭建到运行报告 | 开发 / 自动化测试 |
| [第 5 篇 · 多语言绑定概览](/guide/05-bindings) | JS / Python / .NET 接入 | 开发 |
| [第 6 篇 · 场景案例合集](/guide/06-case-studies) | 5 个完整业务案例 | 所有人 |

## 学习路线

- **产品经理 / 测试**（不写代码）：第 1、2、3、6 篇 —— 能看懂、能评审、能写场景；
- **开发 / 自动化测试**：全系列走一遍，重点第 2、4 篇照着敲；
- **技术负责人**：第 1、3、6 篇，决定团队是否引入 BDD 流程与工具选型。

## 关于本站

本站使用 [VitePress](https://vitepress.dev/) 构建，源码保存在 [GitHub 仓库](https://github.com/cuianbing/gherkin-tutorial)，由 GitHub Actions 与 Netlify 两套流水线分别发布静态站点；仓库只保留源码与配置，构建产物不入库。
