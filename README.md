# Gherkin 从零到一 · BDD 行为描述语言系列教程

面向纯小白的 Gherkin / BDD 教程站点，使用 [VitePress](https://vitepress.dev/) 构建。
仓库只提交 **Markdown 源码 + 站点配置**，构建产物由 CI（GitHub Actions / Netlify）生成，不进入版本库。

- 在线阅读（GitHub Pages）：https://cuianbing.github.io/gherkin-tutorial/
- Netlify：绑定仓库后由 `netlify.toml` 自动构建发布
- GitHub 仓库：https://github.com/cuianbing/gherkin-tutorial

## 项目结构

```text
gherkin-tutorial/
├── docs/                          # VitePress 站点根目录（srcDir）
│   ├── .vitepress/
│   │   ├── config.mts             # 站点配置：导航、侧边栏、搜索、页脚
│   │   └── dist/                  # 构建产物（git 忽略）
│   ├── public/                    # 原样拷贝的静态资源
│   │   └── logo.svg
│   ├── guide/                     # 教程正文（六篇 + 目录页）
│   │   ├── index.md               # 系列目录与学习路线
│   │   ├── 01-what-is-gherkin.md
│   │   ├── 02-syntax.md
│   │   ├── 03-writing-scenarios.md
│   │   ├── 04-cucumber-java.md
│   │   ├── 05-bindings.md
│   │   └── 06-case-studies.md
│   └── index.md                   # 首页（hero + 特性卡片）
├── .github/workflows/
│   └── deploy-pages.yml           # GitHub Pages 构建发布流水线
├── netlify.toml                   # Netlify 构建与响应头配置
├── package.json / package-lock.json
└── .gitignore / .node-version
```

## 本地开发

要求 Node.js >= 18.18（推荐 22）。

```bash
npm install       # 或 npm ci
npm run dev       # 开发服务器 http://localhost:5173
npm run build     # 构建到 docs/.vitepress/dist
npm run preview   # 本地预览构建产物
```

## 部署路径说明

站点通过环境变量 `BASE_PATH` 控制部署前缀：

| 目标 | 命令 | 说明 |
| --- | --- | --- |
| 本地 / Netlify | `npm run build` | `BASE_PATH` 缺省为 `/` |
| GitHub Pages 项目站点 | `BASE_PATH=/gherkin-tutorial/ npm run build` | 已写入 Actions 工作流 |

PowerShell 本地验证 Pages 版本：

```powershell
$env:BASE_PATH='/gherkin-tutorial/'; npm run build; Remove-Item Env:BASE_PATH
```

## Netlify 部署

1. Netlify 控制台 → **Add new site → Import an existing project**，选择 GitHub 仓库 `cuianbing/gherkin-tutorial`；
2. 构建命令与发布目录无需手填，`netlify.toml` 已指定：`npm run build` → `docs/.vitepress/dist`；
3. Node 版本由 `NODE_VERSION=22` 注入，无需额外设置；
4. 每次推送 `main` 即自动构建发布，PR 自动生成 Deploy Preview。

## GitHub Pages 流水线

工作流 `.github/workflows/deploy-pages.yml` 已配置：

- 触发：推送到 `main` 且改动 `docs/**`、`package*.json`、工作流本身，或手动 `workflow_dispatch`；
- 步骤：`npm ci` → `npm run build`（注入 `BASE_PATH=/gherkin-tutorial/`）→ 上传 `docs/.vitepress/dist` → 发布到 Pages；
- 权限：`pages: write` + `id-token: write`，`concurrency` 保证不并发覆盖。

首次使用需在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**；
配置完成后站点地址为 https://cuianbing.github.io/gherkin-tutorial/ ，后续推送自动更新。

## 写作约定

- 新文章放到 `docs/guide/`，文件名用英文短横线小写，中文标题写在正文一级标题里；
- 新增页面后在 `docs/.vitepress/config.mts` 的 `sidebar['/guide/']` 里登记，否则侧边栏看不到；
- 站内链接使用相对 `.md` 路径（如 `./02-syntax.md`），VitePress 构建时会自动转换成 `.html`，写错会导致构建失败；
- 改完先 `npm run dev` 预览，再提交。

## 许可

教程内容 CC BY 4.0；站点代码 MIT。
