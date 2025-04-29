import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServerWithTools } from './server';
import { Tool } from './tools/tool';
import issueTools from './tools/issues/issues';
import { Resource } from './resources/resource';

const tools: Tool[] = [...issueTools];
const resources: Resource[] = [];

async function createServer() {
  const server = createServerWithTools(tools, resources);
  await server.connect(new StdioServerTransport());
  console.error('Jira MCP server running on stdio...');
}

createServer().catch((error) => {
  console.error('Error starting server: ', error);
  process.exit(1);
});
