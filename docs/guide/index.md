# Gherkin 从零到一 · BDD 行为描述语言系列教程

> 面向**纯小白**：不需要任何 BDD/自动化测试经验。从"Gherkin 为什么会出现"讲起，吃透全部语法与场景写作方法，最后用 Cucumber 把特性文件真正跑起来，并给出 5 个拿来即用的场景案例。

## 目录

| 篇章 | 页面 | 内容 |
| --- | --- | --- |
| 第 1 篇 | [认识 Gherkin](./01-what-is-gherkin.md) | 背景（从 TDD 到 BDD）、是什么、能干什么、生态全景、适用边界 |
| 第 2 篇 | [语法详解](./02-syntax.md) | ★重点：Feature/Rule/Scenario、Given/When/Then、场景大纲、数据表、DocString、Tags、**中文关键词** |
| 第 3 篇 | [写出好场景](./03-writing-scenarios.md) | ★重点：三层拆解、GWT 语义纪律、声明式 vs 命令式、反模式清单、实例化需求 |
| 第 4 篇 | [Cucumber 实战（Java）](./04-cucumber-java.md) | ★重点：Maven 工程、Step Definitions、参数转换、DataTable、Hooks、报告、中文步骤 |
| 第 5 篇 | [多语言绑定概览](./05-bindings.md) | JavaScript / Python(behave) / .NET(Reqnroll) 的接入方式与选型建议 |
| 第 6 篇 | [场景案例合集](./06-case-studies.md) | 5 个完整案例：ATM 取款、购物车、登录大纲、API 测试、中文特性文件 |

## 版本约定（教程写作时点：2026 年 11 月）

| 组件 | 版本 | 说明 |
| --- | --- | --- |
| Gherkin 语言规范 | 6+ | 6 引入 `Rule` 关键字与多语言关键词，本系列覆盖当前语法 |
| Cucumber-JVM（Java 绑定） | 7.34.x（cucumber-bom） | v8 尚在里程碑阶段，教程基于稳定的 7.x |
| @cucumber/cucumber（JS 绑定） | 13.x | 旧包名 `cucumber` 已弃用 |
| behave（Python 绑定） | 1.3.x | Python 侧主流 Gherkin 工具 |
| .NET 绑定 | Reqnroll | **SpecFlow 已于 2024 年底停止维护**，Reqnroll 是社区指定的继任者 |

> Gherkin 语法本身多年稳定，学习不必担心"版本过时"；会漂移的是各语言 Cucumber 绑定的版本号，写代码时取各自最新稳定版即可。

## 你将学到什么

```text
特性文件(人写的)                    步骤代码(绑定)
┌──────────────────────┐          ┌──────────────────────┐
│ 功能: 登录             │          │ @当("输入用户名 {string}") │
│   场景: 正确密码登录     │   匹配    │ public void 输入用户名(...) │
│     假如 用户在登录页    │ ───────▶ │     // 自动化动作       │
│     当 输入正确的账号密码 │          │  }                   │
│     那么 应跳转到首页    │          └──────────────────────┘
└──────────────────────┘                  │
        ▲ 产品/测试都看得懂                 ▼
                                    自动执行,输出测试报告
```

1. **读懂并写出规范的 `.feature` 文件**（第 1~3 篇，不需要写代码）；
2. **把场景绑定到代码并自动执行**（第 4~5 篇，选一种语言落地）；
3. **在真实业务里用起来**（第 6 篇案例 + 团队落地建议）。

## 学习路线建议

1. **产品经理/测试**（不写代码）：读第 1、2、3、6 篇——能看懂、能评审、能写场景；
2. **开发/自动化测试**：全系列走一遍，重点第 2、4 篇照着敲；
3. **技术负责人**：读第 1、3、6 篇，决定团队是否引入 BDD 流程与工具选型。

## 参考资料与官方资源

- Gherkin 语法参考（官方）：https://cucumber.io/docs/gherkin/reference/
- Cucumber 官方文档：https://cucumber.io/docs/cucumber/
- Gherkin 语言规范源码：https://github.com/cucumber/gherkin
- Cucumber-JVM：https://github.com/cucumber/cucumber-jvm
- Cucumber-JS：https://github.com/cucumber/cucumber-js
- behave（Python）：https://behave.readthedocs.io/
- Reqnroll（.NET）：https://reqnroll.net/
- 多语言关键词完整表：https://github.com/cucumber/gherkin/blob/main/gherkin-languages.json
