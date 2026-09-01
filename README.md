# AlexuLab

Personal experiments, reviews and notes about AI tools, LLM APIs and developer workflows.

---

## About

AlexuLab is a personal AI exploration repository focused on:

- AI tools testing
- LLM API experiments
- MCP server exploration
- Developer workflow automation
- Technical notes and reviews

This repository records experiments, ideas and practical experiences while exploring modern AI development tools.

---

## Repository Structure

```text
AlexuLab
│
├── examples
│   └── Practical examples and AI workflow experiments
│
├── notes
│   └── Research notes, tutorials and learning records
│
├── LICENSE
│
└── README.md
```

## Examples

Current experiments:

### LLM API Demo

A simple experiment exploring LLM API workflows.

Topics include:

- API connection
- Prompt testing
- Model response handling
- AI-assisted development workflows

More experiments will be added over time.

### MCP Memory Write Verification

One small Node.js sketch from a recent MCP debugging note. It keeps a tool call
separate from a confirmed storage write: `remember` returns a record ID from the
storage layer, retries only the failed write with the same idempotency key, then
reads the record back.

Run it with a recent Node.js version:

```bash
node examples/mcp-memory-write-verification.js
```

See [the example](examples/mcp-memory-write-verification.js).

---

## Notes

Technical notes and research records about:

- AI tools
- LLM applications
- Developer productivity
- Automation workflows

---

## Goals

The purpose of this repository is to:

- Document my AI learning journey
- Share practical experiments
- Test new AI development tools
- Build reusable workflows

---

## Updates

This repository is continuously updated with new experiments and notes.

---

## License

MIT License
