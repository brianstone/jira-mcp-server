import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Tool } from './tools/tool';
import { Resource } from './resources/resource';

export function createServerWithTools(tools: Tool[], resources: Resource[]): Server {
  const server = new Server(
    { name: 'jira-mcp-server', version: '0.0.1' },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: tools.map((tool) => tool.schema) };
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return { resources: resources.map((resource) => resource.schema) };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find((tool) => tool.schema.name === request.params.name);
    if (!tool) {
      return {
        content: [{ type: 'text', text: `Tool ${request.params.name} not found.` }],
        isError: true,
      };
    }

    try {
      const toolResult = await tool.handle(request.params.arguments);

      if (!toolResult) {
        return {
          content: [{ type: 'text', text: `Tool ${request.params.name} did not return a result.` }],
          isError: true,
        };
      }

      return toolResult;
    } catch (error) {
      return {
        content: [{ type: 'text', text: String(error) }],
        isError: true,
      };
    }
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const resource = resources.find((resource) => resource.schema.uri === request.params.uri);

    if (!resource) {
      return { contents: [] };
    }

    const contents = await resource.read(request.params.uri);
    return { contents };
  });

  return server;
}
