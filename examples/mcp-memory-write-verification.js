/**
 * A dependency-free sketch of an MCP memory tool contract.
 *
 * The point is not that a tool was invoked. The point is that storage created
 * a durable record and returned its identity, so the server can verify it.
 *
 * Run with: node examples/mcp-memory-write-verification.js
 */

class TransientStorageError extends Error {}

class MemoryStore {
  #records = new Map();
  #idempotencyIndex = new Map();
  #failedOnce = new Set();

  write({ content, source, idempotencyKey }) {
    const existingId = this.#idempotencyIndex.get(idempotencyKey);
    if (existingId) {
      return this.#records.get(existingId);
    }

    // Simulate an intermittent failure before the first successful write.
    if (!this.#failedOnce.has(idempotencyKey)) {
      this.#failedOnce.add(idempotencyKey);
      throw new TransientStorageError("temporary storage failure before commit");
    }

    const record = {
      id: `mem_${crypto.randomUUID()}`,
      revision: 1,
      content,
      source,
      storedAt: new Date().toISOString(),
    };

    this.#records.set(record.id, record);
    this.#idempotencyIndex.set(idempotencyKey, record.id);
    return record;
  }

  get(recordId) {
    return this.#records.get(recordId);
  }
}

async function remember({ store, content, source, idempotencyKey }) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const record = store.write({ content, source, idempotencyKey });
      return {
        stored: true,
        recordId: record.id,
        revision: record.revision,
        attempt,
      };
    } catch (error) {
      if (!(error instanceof TransientStorageError) || attempt === 3) {
        throw error;
      }

      console.log(`write attempt ${attempt} did not commit; retrying the write only`);
    }
  }
}

async function main() {
  const store = new MemoryStore();
  const request = {
    content: "MCP tools need evidence of persistence, not only a successful call.",
    source: "local-demo",
    idempotencyKey: "demo-memory-001",
  };

  const toolResult = await remember({ store, ...request });
  const persisted = store.get(toolResult.recordId);

  if (!persisted) {
    throw new Error("Tool returned success, but storage cannot read the record back.");
  }

  const repeatedCall = await remember({ store, ...request });
  if (repeatedCall.recordId !== toolResult.recordId) {
    throw new Error("A retry created a duplicate memory record.");
  }

  console.log("tool result:", toolResult);
  console.log("read-back record:", persisted);
  console.log("same idempotency key returned the same record:", repeatedCall.recordId);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
