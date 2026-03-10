# academic-search-skill / 学术检索 Skill

A minimal AgentSkill for academic paper search and summarization.

这个仓库提供一个简单的 **学术论文检索与总结 Skill**，用于 OpenClaw / Codex 一类代理。
核心能力：

- 利用已有的 Web 搜索工具（例如通过 `web_search` 调用 Brave Search）在学术站点检索：
  - arXiv
  - Google Scholar（可索引的公开页面）
  - 期刊/出版社站点（IEEE, ACM, Springer, ScienceDirect 等）
- 使用 `web_fetch` 抓取论文摘要/页面内容；
- 生成结构化的中文总结，包括：
  - 标题（英文原文，附简单中文意译）
  - 作者 / 年份 / 发表渠道
  - 研究问题
  - 方法
  - 主要结论
  - 局限 / 注意点
  - 原文链接
- 隐私优先：对外只发送“主题关键词”，**不包含用户身份、服务器 IP 或原始私密文档内容**。

All agent-facing logic and usage instructions live in
[`academic-search/SKILL.md`](./academic-search/SKILL.md). This README is only
for humans browsing the repo.

所有给“智能体”看的说明都在 [`academic-search/SKILL.md`](./academic-search/SKILL.md) 中，
本 README 只面向人类读者，方便你了解 Skill 的用途与用法。

## Layout / 目录结构

```text
academic-search-skill/
  academic-search/
    SKILL.md    # AgentSkill definition & usage (智能体使用说明)
  README.md     # Human-facing overview (人类说明文档)
```

## Usage / 使用方式

1. **复制 Skill 目录**  
   将 `academic-search/` 目录拷贝到你的 OpenClaw 工作空间中的 `skills` 目录，例如：
   
   ```text
   /root/.openclaw/workspace/skills/academic-search/
   ```

2. **确保可用的工具**  
   代理需要具备与 `web_search`、`web_fetch` 等价的工具能力（OpenClaw 默认已提供）。

3. **配置触发条件**  
   让代理在遇到类似请求时优先触发本 Skill：
   
   - "帮我查一下关于 X 的论文 / 文献"
   - "谷歌学术 搜索 X"
   - "做一个 X 方向的文献综述 / 研究进展"
   - "找几篇代表性论文，对比一下结论 / 方法"

4. **代理执行流程（概念上）**  
   代理应按照 `SKILL.md` 中描述的流程：
   
   - 将中文主题转成简洁的英文检索关键词；
   - 限定学术站点（arXiv、scholar、期刊官网等）；
   - 使用 `web_fetch` 抓取摘要/正文；
   - 按条目汇总若干代表性论文，并给出整体研究趋势/共识与差异。

## Privacy & Safety / 隐私与安全

- 只对外发送必要的主题关键词；
- 不携带用户姓名、账号、服务器 IP、项目代号或合同原文；
- 不在服务器上安装来历不明的第三方二进制/脚本；
- 仅访问公开可见的摘要/论文页面，不尝试绕过登录/付费墙。

具体的安全约束与使用细节，请参考 [`academic-search/SKILL.md`](./academic-search/SKILL.md)。

