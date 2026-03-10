# academic-search-skill

A minimal AgentSkill for academic paper search and summarization.

This skill is designed for OpenClaw / Codex-style agents and focuses on:

- Using an existing web search tool (e.g. Brave Search via `web_search`) to query
  academic sources such as arXiv, Google Scholar and publisher sites (IEEE, ACM,
  Springer, ScienceDirect, etc.).
- Fetching article/abstract pages with `web_fetch`.
- Producing structured summaries in Chinese, with:
  - title
  - authors / year / venue
  - research question
  - method
  - main conclusions
  - limitations / caveats
  - source links
- Preserving user privacy: only high-level topic keywords are sent to search
  engines, never user identities, server IPs or raw private documents.

All of the agent-facing logic and usage instructions live in
[`academic-search/SKILL.md`](./academic-search/SKILL.md) (this is what the agent
loads). This README is only for humans browsing the repo.

## Layout

```text
academic-search-skill/
  academic-search/
    SKILL.md    # AgentSkill definition and usage instructions
  README.md     # Human-facing overview (this file)
```

## Usage

1. Copy the `academic-search/` directory into your OpenClaw workspace
   (typically `skills/academic-search`).
2. Ensure your agent has access to tools equivalent to `web_search` and
   `web_fetch`.
3. Configure your agent so that this skill triggers on queries like:
   - "帮我查一下关于 X 的论文 / 文献"
   - "谷歌学术 搜索 X"
   - "做一个 X 方向的文献综述/研究进展"
4. The agent should then follow the workflow defined in `SKILL.md` to:
   - construct English search keywords;
   - restrict results to academic domains;
   - fetch and summarize a small set of representative papers.

