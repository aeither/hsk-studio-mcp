# HSK Studio MCP

A read-only MCP server that gives an AI agent HSK vocabulary, graded Chinese
readings, and an HSK level estimate for any Chinese text. It needs no API key.

Endpoint: `https://hsk.fulinlabs.com/api/agent/mcp` (streamable HTTP, stateless)

Use it when a learner asks an agent things like "what level is this article?",
"give me HSK 3 words I should know", or "find me a short reading at my level".

## Connect

Claude Code:

```bash
claude mcp add --transport http hsk-studio https://hsk.fulinlabs.com/api/agent/mcp
```

Any other client that supports remote MCP servers: add the endpoint above with
no authentication.

## Tools

| Tool | What it returns |
| --- | --- |
| `lookup_word` | Pinyin, meaning and HSK level for a Chinese word, a pinyin string or an English word, plus related words |
| `list_words_by_level` | Words of one HSK level (1 to 7, where 7 is the HSK 7-9 band) in syllabus order |
| `list_readings` | The graded Chinese readings, each with a computed HSK level |
| `get_reading` | The text, level and vocabulary of one reading |
| `check_text_level` | An HSK level estimate for up to 5000 characters of Chinese text |
| `get_level_check_link` | The HSK Studio page where a learner can check their own text and share the result |

Results carry a `url` field. Show it to the learner so they can open the text in
HSK Studio, where they tap any word for pinyin, meaning and audio.

## REST API

The same data is available over plain HTTP. `GET https://hsk.fulinlabs.com/api/agent`
returns an index of the endpoints.

## About this repository

This repository holds the listing metadata and documentation for the hosted
server. The server itself runs inside HSK Studio at https://hsk.fulinlabs.com.

## License

MIT, for the files in this repository.
